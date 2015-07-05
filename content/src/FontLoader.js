// A modified version of FontLoader removing the Adobe Blank logic.

var isIE = /MSIE/i.test(navigator.userAgent),
  ieVer = null;

// Get Internet Explorer version
if (isIE) {
  var re, result;
  re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
  result = re.exec(navigator.userAgent);
  if (result !== null) {
    ieVer = parseFloat(result[1]);
  }
}

/**
 * FontLoader detects when web fonts specified in the "fontFamiliesArray" array were loaded and rendered. Then it
 * notifies the specified delegate object via "fontLoaded" and "fontsLoaded" methods when specific or all fonts were
 * loaded respectively. The use of this functions implies that the insertion of specified web fonts into the
 * document is done elsewhere.
 *
 * If timeout (default 3000ms) is reached before all fonts were loaded and rendered, then "fontsLoaded" delegate
 * method is invoked with an error object as its single parameter. The error object has two fields: the "message"
 * field holding the error description and the "notLoadedFontFamilies" field holding an array with all the
 * font-families that weren't loaded. Otherwise the parameter is null.
 *
 * @param {Array}     fontFamiliesArray       Array of font-family strings.
 * @param {Object}    delegate                Delegate object whose delegate methods will be invoked in its own context.
 * @param {Function}  [delegate.fontsLoaded]  Delegate method invoked after all fonts are loaded or timeout is reached.
 * @param {Function}  [delegate.fontLoaded]   Delegate method invoked for each loaded font with its font-family string as its single parameter.
 * @param {Number}    [timeout=3000]          Timeout in milliseconds. Pass "null" to disable timeout.
 * @constructor
 */
function FontLoader(fontFamiliesArray, delegate, timeout) {
  // Public
  this.delegate = delegate;
  this.timeout = (typeof timeout !== "undefined") ? timeout : 60000;

  // Private
  this._fontFamiliesArray = fontFamiliesArray.slice(0);
  this._testContainer = null;
  this._timeoutId = null;
  this._intervalId = null;
  this._intervalDelay = 50;
  this._numberOfLoadedFonts = 0;
  this._numberOfFontFamilies = this._fontFamiliesArray.length;
  this._fontsMap = {};
  this._finished = false;
}

FontLoader.testDiv = null;
FontLoader.useResizeEvent = isIE && ieVer < 11.0 && typeof document.attachEvent !== "undefined";
FontLoader.useIntervalChecking = window.opera || (isIE && ieVer < 11.0 && !FontLoader.useResizeEvent);
FontLoader.referenceText = " !\"\\#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~";
FontLoader.referenceFontFamilies = ["serif", "cursive"];
FontLoader.referenceFontFamiliesSizes = [];

FontLoader.prototype = {
  constructor: FontLoader,
  loadFonts: function() {
    var self = this;

    if (this._numberOfFontFamilies === 0) {
      this._finish();
      return;
    }

    if (this.timeout !== null) {
      this._timeoutId = window.setTimeout(function timeoutFire() {
        self._finish();
      }, this.timeout);
    }

    // Use constant line-height so there won't be changes in height
    this._testContainer = document.createElement("div");
    this._testContainer.style.cssText = "position:absolute; left:-10000px; top:-10000px; white-space:nowrap; font-size:72px; visibility:hidden;";

    if (FontLoader.testDiv === null) {
      this._runOnce();
    } else {
      this._loadFonts();
    }
  },
  _runOnce: function() {
    var self = this,
      clonedDiv, j;

    // Create testFiv template that will be cloned for each font
    FontLoader.testDiv = document.createElement("div");
    FontLoader.testDiv.style.position = "absolute";
    FontLoader.testDiv.appendChild(document.createTextNode(FontLoader.referenceText));

    // Get default dimensions
    clonedDiv = FontLoader.testDiv.cloneNode(true);
    this._testContainer.appendChild(clonedDiv);
    document.body.appendChild(this._testContainer);

    for (j = 0; j < FontLoader.referenceFontFamilies.length; j++) {
      clonedDiv.style.fontFamily = FontLoader.referenceFontFamilies[j];
      FontLoader.referenceFontFamiliesSizes.push(new Size(clonedDiv.offsetWidth, clonedDiv.offsetHeight));
    }

    this._testContainer.parentNode.removeChild(this._testContainer);
    clonedDiv.parentNode.removeChild(clonedDiv);
    this._loadFonts();
  },
  _loadFonts: function() {
    var i, j, clonedDiv, sizeWatcher, sizeWatchers = [],
      self = this;

    // Add div for each font-family
    for (i = 0; i < this._numberOfFontFamilies; i++) {
      this._fontsMap[this._fontFamiliesArray[i]] = true;

      if (FontLoader.useResizeEvent) {
        for (j = 0; j < FontLoader.referenceFontFamilies.length; j++) {
          clonedDiv = FontLoader.testDiv.cloneNode(true);
          clonedDiv.setAttribute("data-font-family", this._fontFamiliesArray[i]);
          clonedDiv.setAttribute("data-ref-font-family-index", String(j));
          clonedDiv.style.fontFamily = FontLoader.referenceFontFamilies[j];
          this._testContainer.appendChild(clonedDiv);
        }
      } else if (FontLoader.useIntervalChecking) {
        for (j = 0; j < FontLoader.referenceFontFamilies.length; j++) {
          clonedDiv = FontLoader.testDiv.cloneNode(true);
          clonedDiv.setAttribute("data-font-family", this._fontFamiliesArray[i]);
          clonedDiv.setAttribute("data-ref-font-family-index", String(j));
          clonedDiv.style.fontFamily = "'" + this._fontFamiliesArray[i] + "', " + FontLoader.referenceFontFamilies[j];
          this._testContainer.appendChild(clonedDiv);
        }
      } else {
        for (j = 0; j < FontLoader.referenceFontFamilies.length; j++) {
          clonedDiv = FontLoader.testDiv.cloneNode(true);
          clonedDiv.setAttribute("data-font-family", this._fontFamiliesArray[i]);
          clonedDiv.setAttribute("data-ref-font-family-index", String(j));
          clonedDiv.style.fontFamily = FontLoader.referenceFontFamilies[j];
          sizeWatcher = new SizeWatcher(/** @type HTMLElement */clonedDiv, {
            container: this._testContainer,
            delegate: this,
            size: FontLoader.referenceFontFamiliesSizes[j],
            direction: SizeWatcher.directions.increase,
            dimension: SizeWatcher.dimensions.horizontal
          });
          // The prepareForWatch() and beginWatching() methods will be invoked in separate iterations to
          // reduce number of browser's CSS recalculations.
          sizeWatchers.push(sizeWatcher);
        }
      }
    }

    // Append the testContainer after all test elements to minimize DOM insertions
    document.body.appendChild(this._testContainer);

    if (FontLoader.useResizeEvent) {
      for (j = 0; j < this._testContainer.childNodes.length; j++) {
        clonedDiv = this._testContainer.childNodes[j];
        // "resize" event works only with attachEvent
        clonedDiv.attachEvent("onresize", (function(self, clonedDiv) {
          return function() {
            self._elementSizeChanged(clonedDiv);
          }
        })(this, clonedDiv));
      }
      window.setTimeout(function() {
        for (j = 0; j < self._testContainer.childNodes.length; j++) {
          clonedDiv = self._testContainer.childNodes[j];
          clonedDiv.style.fontFamily = "'" + clonedDiv.getAttribute("data-font-family") + "', " + FontLoader.referenceFontFamilies[clonedDiv.getAttribute("data-ref-font-family-index")];
        }
      }, 0);
    } else if (FontLoader.useIntervalChecking) {
      // Start polling element sizes but also do first synchronous check in case all fonts where already loaded.
      this._intervalId = window.setInterval(function intervalFire() {
        self._checkSizes();
      }, this._intervalDelay);
      this._checkSizes();
    } else {
      // We are dividing the prepareForWatch() and beginWatching() methods to optimize browser performance by
      // removing CSS recalculation from each iteration to the end of iterations.
      for (i = 0; i < this._numberOfFontFamilies * FontLoader.referenceFontFamilies.length; i++) {
        sizeWatcher = sizeWatchers[i];
        sizeWatcher.prepareForWatch();
      }
      for (i = 0; i < this._numberOfFontFamilies * FontLoader.referenceFontFamilies.length; i++) {
        sizeWatcher = sizeWatchers[i];
        sizeWatcher.beginWatching();
        // Apply tested font-family
        clonedDiv = sizeWatcher.getWatchedElement();
        clonedDiv.style.fontFamily = "'" + clonedDiv.getAttribute("data-font-family") + "', " + FontLoader.referenceFontFamilies[clonedDiv.getAttribute("data-ref-font-family-index")];
      }
    }
  },
  _checkSizes: function() {
    var i, testDiv, currSize, refSize;
    for (i = this._testContainer.childNodes.length - 1; i >= 0; i--) {
      testDiv = this._testContainer.childNodes[i];
      currSize = new Size(testDiv.offsetWidth, testDiv.offsetHeight);
      refSize = FontLoader.referenceFontFamiliesSizes[testDiv.getAttribute("data-ref-font-family-index")];
      if (!refSize.isEqual(currSize)) {
        // Element dimensions changed, this means its font loaded, remove it from testContainer div
        testDiv.parentNode.removeChild(testDiv);
        this._elementSizeChanged(testDiv);
      }
    }
  },
  _elementSizeChanged: function(element) {
    var fontFamily = element.getAttribute("data-font-family");

    if (this._finished) {
      return;
    }

    // Check that the font of this element wasn't already marked as loaded by an element with different reference font family.
    if (typeof this._fontsMap[fontFamily] === "undefined") {
      return;
    }

    this._numberOfLoadedFonts++;
    delete this._fontsMap[fontFamily];

    if (this.delegate && typeof this.delegate.fontLoaded === "function") {
      this.delegate.fontLoaded(fontFamily);
    }

    if (this._numberOfLoadedFonts === this._numberOfFontFamilies) {
      this._finish();
    }
  },
  _finish: function() {
    var callbackParameter,
      fontFamily,
      notLoadedFontFamilies = [];

    if (this._finished) {
      return;
    }

    this._finished = true;

    if (this._testContainer !== null) {
      this._testContainer.parentNode.removeChild(this._testContainer);
    }

    if (this._timeoutId !== null) {
      window.clearTimeout(this._timeoutId);
    }

    if (this._intervalId !== null) {
      window.clearInterval(this._intervalId);
    }

    if (this._numberOfLoadedFonts < this._numberOfFontFamilies) {
      for (fontFamily in this._fontsMap) {
        if (this._fontsMap.hasOwnProperty(fontFamily)) {
          notLoadedFontFamilies.push(fontFamily);
        }
      }
      callbackParameter = {
        message: "Not all fonts were loaded",
        notLoadedFontFamilies: notLoadedFontFamilies
      };
    } else {
      callbackParameter = null;
    }
    if (this.delegate && typeof this.delegate.fontsLoaded === "function") {
      this.delegate.fontsLoaded(callbackParameter);
    }
  },
  /**
   * SizeWatcher delegate method
   * @param {SizeWatcher} sizeWatcher
   */
  sizeWatcherChangedSize: function(sizeWatcher) {
    var watchedElement = sizeWatcher.getWatchedElement();
    this._elementSizeChanged(watchedElement);
  }
};

/**
 * Size object
 *
 * @param width
 * @param height
 * @constructor
 */
function Size(width, height) {
  this.width = width;
  this.height = height;
}

/**
 * Compares receiver object to passed in size object.
 *
 * @param otherSize
 * @returns {boolean}
 */
Size.prototype.isEqual = function(otherSize) {
  return (this.width === otherSize.width && this.height === otherSize.height);
};

/**
 * SizeWatcher observes size of an element and notifies when its size is changed. It doesn't use any timeouts
 * to check the element size, when change in size occurs a callback method immediately invoked.
 *
 * To watch for element's size changes the element, and other required elements are appended to a container element
 * you specify, and which must be added to the DOM tree before invoking prepareForWatch() method. Your container
 * element should be positioned outside of client's visible area. Therefore you shouldn't use SizeWatcher to watch
 * for size changes of elements used for UI.
 * Such container element could be a simple <div> that is a child of the <body> element:
 * <div style="position:absolute; left:-10000px; top:-10000px;"></div>
 *
 * You must invoke SizeWatcher's methods in a specific order to establish size change listeners:
 *
 * 1. Create SizeWatcher instance by invoke SizeWatcher constructor passing the element (size of which you want to
 *    observe), the container element, the delegate object and optional size parameter of type Size which should be
 *    the pre-calculated initial size of your element.
 * 4. Invoke prepareForWatch() method. This method will calculate element size if you didn't passed it to the constructor.
 * 5. Invoke beginWatching() method. This method will set event listeners and invoke your delegate's method once
 *    element size changes.
 *
 * Failing to invoke above methods in their predefined order will throw an exception.
 *
 * @param {HTMLElement} element An element, size of which will be observed for changes.
 * @param {Object}      options
 * @param {HTMLElement} options.container An element to which special observing elements will be added. Must be in DOM tree
 *                      when prepareForWatch() method is called.
 * @param {Object}      options.delegate A delegate object with a sizeWatcherChangedSize method which will be invoked, in
 *                      context of the delegate object, when change in size occurs. This method is invoked with single
 *                      parameter which is the current SizeWatcher instance.
 * @param {Size}        [options.size] The pre-calculated initial size of your element. When passed, the element is not
 *                      asked for offsetWidth and offsetHeight, which may be useful to reduce browser's CSS
 *                      recalculations. If you will not pass the size parameter then its size calculation will be
 *                      deferred to prepareForWatch() method.
 * @param {Boolean}     [options.continuous=false] A boolean flag indicating if the SizeWatcher will watch only for
 *                      the first size change (default) or will continuously watch for size changes.
 * @param {Number}      [options.direction=SizeWatcher.directions.both] The direction of size change that should be
 *                      watched: SizeWatcher.directions.increase, SizeWatcher.directions.decrease or
 *                      SizeWatcher.directions.both
 * @param {Number}      [options.dimension=SizeWatcher.dimensions.both] The dimension of size change that should be
 *                      watched: SizeWatcher.dimensions.horizontal, SizeWatcher.dimensions.vertical or
 *                      SizeWatcher.dimensions.both
 * @constructor
 */
function SizeWatcher(element, options) {
  this._element = element;
  this._delegate = options.delegate;
  this._size = null;
  this._continuous = !!options.continuous;
  this._direction = options.direction ? options.direction : SizeWatcher.directions.both;
  this._dimension = options.dimension ? options.dimension : SizeWatcher.dimensions.both;
  this._sizeIncreaseWatcherContentElm = null;
  this._sizeDecreaseWatcherElm = null;
  this._sizeIncreaseWatcherElm = null;
  this._state = SizeWatcher.states.initialized;
  this._scrollAmount = 2;

  this._generateScrollWatchers(options.size);
  this._appendScrollWatchersToElement(options.container);
}

SizeWatcher.states = {
  initialized: 0,
  generatedScrollWatchers: 1,
  appendedScrollWatchers: 2,
  preparedScrollWatchers: 3,
  watchingForSizeChange: 4
};

SizeWatcher.directions = {
  decrease: 1,
  increase: 2,
  both: 3
};

SizeWatcher.dimensions = {
  horizontal: 1,
  vertical: 2,
  both: 3
};

//noinspection JSUnusedLocalSymbols
SizeWatcher.prototype = {
  constructor: SizeWatcher,
  getWatchedElement: function() {
    return this._element;
  },
  setSize: function(size) {
    this._size = size;
    //noinspection JSBitwiseOperatorUsage
    if (this._direction & SizeWatcher.directions.increase) {
      this._sizeIncreaseWatcherContentElm.style.cssText = "width: " + (size.width + this._scrollAmount) + "px; height: " + (size.height + this._scrollAmount) + "px;";
    }
    //noinspection JSBitwiseOperatorUsage
    if (this._direction & SizeWatcher.directions.decrease) {
      this._sizeDecreaseWatcherElm.style.cssText = "position:absolute; left: 0px; top: 0px; overflow: hidden; width: " + (size.width - this._scrollAmount) + "px; height: " + (size.height - this._scrollAmount) + "px;";
    }
  },
  _generateScrollWatchers: function(size) {

    this._element.style.position = "absolute";

    //noinspection JSBitwiseOperatorUsage
    if (this._direction & SizeWatcher.directions.increase) {
      this._sizeIncreaseWatcherContentElm = document.createElement("div");

      this._sizeIncreaseWatcherElm = document.createElement("div");
      this._sizeIncreaseWatcherElm.style.cssText = "position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow: hidden;";
      this._sizeIncreaseWatcherElm.appendChild(this._sizeIncreaseWatcherContentElm);

      this._element.appendChild(this._sizeIncreaseWatcherElm);
    }

    //noinspection JSBitwiseOperatorUsage
    if (this._direction & SizeWatcher.directions.decrease) {
      this._sizeDecreaseWatcherElm = document.createElement("div");
      this._sizeDecreaseWatcherElm.appendChild(this._element);
    }

    if (size) {
      this.setSize(size);
    }

    this._state = SizeWatcher.states.generatedScrollWatchers;
  },
  _appendScrollWatchersToElement: function(container) {
    if (this._state !== SizeWatcher.states.generatedScrollWatchers) {
      throw new Error("SizeWatcher._appendScrollWatchersToElement() was invoked before SizeWatcher._generateScrollWatchers()");
    }

    //noinspection JSBitwiseOperatorUsage
    if (this._direction & SizeWatcher.directions.decrease) {
      container.appendChild(this._sizeDecreaseWatcherElm);
    } else {
      container.appendChild(this._element);
    }

    this._state = SizeWatcher.states.appendedScrollWatchers;
  },
  removeScrollWatchers: function() {
    //noinspection JSBitwiseOperatorUsage
    if (this._direction & SizeWatcher.directions.decrease) {
      if (this._sizeDecreaseWatcherElm.parentNode) {
        this._sizeDecreaseWatcherElm.parentNode.removeChild(this._sizeDecreaseWatcherElm);
      }
    } else if (this._element.parentNode) {
      this._element.parentNode.removeChild(this._element);
    }
  },
  prepareForWatch: function() {
    var parentNode,
      sizeDecreaseWatcherElmScrolled = true,
      sizeIncreaseWatcherElmScrolled = true;

    if (this._state !== SizeWatcher.states.appendedScrollWatchers) {
      throw new Error("SizeWatcher.prepareForWatch() invoked before SizeWatcher._appendScrollWatchersToElement()");
    }

    if (this._size === null) {
      this.setSize(new Size(this._element.offsetWidth, this._element.offsetHeight));
    }

    //noinspection JSBitwiseOperatorUsage
    if (this._direction & SizeWatcher.directions.decrease) {
      sizeDecreaseWatcherElmScrolled = this._scrollElementToBottomRight(this._sizeDecreaseWatcherElm);
    }
    //noinspection JSBitwiseOperatorUsage
    if (this._direction & SizeWatcher.directions.increase) {
      sizeIncreaseWatcherElmScrolled = this._scrollElementToBottomRight(this._sizeIncreaseWatcherElm);
    }

    // Check if scroll positions updated.
    if (!sizeDecreaseWatcherElmScrolled || !sizeIncreaseWatcherElmScrolled) {

      // Traverse tree to the top node to see if element is in the DOM tree.
      parentNode = this._element.parentNode;
      while (parentNode !== window.document && parentNode !== null) {
        parentNode = parentNode.parentNode;
      }

      if (parentNode === null) {
        throw new Error("Can't set scroll position of scroll watchers. SizeWatcher is not in the DOM tree.");
      } else if (console && typeof console.warn === "function") {
        console.warn("SizeWatcher can't set scroll position of scroll watchers.");
      }
    }

    this._state = SizeWatcher.states.preparedScrollWatchers;
  },
  _scrollElementToBottomRight: function(element) {
    var elementScrolled = true;
    //noinspection JSBitwiseOperatorUsage
    if (this._dimension & SizeWatcher.dimensions.vertical) {
      element.scrollTop = this._scrollAmount;
      elementScrolled = elementScrolled && element.scrollTop > 0;
    }
    //noinspection JSBitwiseOperatorUsage
    if (this._dimension & SizeWatcher.dimensions.horizontal) {
      element.scrollLeft = this._scrollAmount;
      elementScrolled = elementScrolled && element.scrollLeft > 0;
    }
    return elementScrolled;
  },
  beginWatching: function() {
    if (this._state !== SizeWatcher.states.preparedScrollWatchers) {
      throw new Error("SizeWatcher.beginWatching() invoked before SizeWatcher.prepareForWatch()");
    }

    //noinspection JSBitwiseOperatorUsage
    if (this._direction & SizeWatcher.directions.decrease) {
      //noinspection JSValidateTypes
      this._sizeDecreaseWatcherElm.addEventListener("scroll", this, false);
    }
    //noinspection JSBitwiseOperatorUsage
    if (this._direction & SizeWatcher.directions.increase) {
      //noinspection JSValidateTypes
      this._sizeIncreaseWatcherElm.addEventListener("scroll", this, false);
    }

    this._state = SizeWatcher.states.watchingForSizeChange;
  },
  endWatching: function() {
    if (this._state !== SizeWatcher.states.watchingForSizeChange) {
      throw new Error("SizeWatcher.endWatching() invoked before SizeWatcher.beginWatching()");
    }

    //noinspection JSBitwiseOperatorUsage
    if (this._direction & SizeWatcher.directions.decrease) {
      //noinspection JSValidateTypes
      this._sizeDecreaseWatcherElm.removeEventListener("scroll", this, false);
    }
    //noinspection JSBitwiseOperatorUsage
    if (this._direction & SizeWatcher.directions.increase) {
      //noinspection JSValidateTypes
      this._sizeIncreaseWatcherElm.removeEventListener("scroll", this, false);
    }
    this._state = SizeWatcher.states.appendedScrollWatchers;
  },
  /**
   * @private
   */
  handleEvent: function(event) {
    var newSize, oldSize;

    // This is not suppose to happen because when we run endWatching() we remove scroll listeners.
    // But some browsers will fire second scroll event which was pushed into event stack before listener was
    // removed so do this check anyway.
    if (this._state !== SizeWatcher.states.watchingForSizeChange) {
      return;
    }

    newSize = new Size(this._element.offsetWidth, this._element.offsetHeight);
    oldSize = this._size;

    // Check if element size is changed. How come that element size isn't changed but scroll event fired?
    // This can happen in two cases: when double scroll occurs or immediately after calling prepareForWatch()
    // (event if scroll event listeners attached after it).
    // The double scroll event happens when one size dimension (e.g.:width) is increased and another
    // (e.g.:height) is decreased.
    if (oldSize.isEqual(newSize)) {
      return;
    }

    if (this._delegate && typeof this._delegate.sizeWatcherChangedSize === "function") {
      this._delegate.sizeWatcherChangedSize(this);

      // Check that endWatching() wasn't invoked from within the delegate.
      if (this._state !== SizeWatcher.states.watchingForSizeChange) {
        return;
      }
    }

    if (!this._continuous) {
      this.endWatching();
    } else {
      // Set the new size so in case of double scroll event we won't cause the delegate method to be executed twice
      // and also to update to the new watched size.
      this.setSize(newSize);
      // change state so prepareFowWatch() won't throw exception about wrong order invocation.
      this._state = SizeWatcher.states.appendedScrollWatchers;
      // Run prepareForWatch to reset the scroll watchers, we have already set the size
      this.prepareForWatch();
      // Set state to listeningForSizeChange, there is no need to invoke beginWatching() method as scroll event
      // listeners and callback are already set.
      this._state = SizeWatcher.states.watchingForSizeChange;

    }
  }
};

module.exports = FontLoader;
