/*! Ben's jQuery UI Extensions - v1.1.1 - 2014-03-30
* https://github.com/bseth99/jquery-ui-extensions
* Includes: jquery.ui.spinner.js, jquery.ui.combobox.js, jquery.ui.labeledslider.js, jquery.ui.slidespinner.js, jquery.ui.timepicker.js, jquery.ui.waitbutton.js
* Copyright 2014 Ben Olson; Licensed MIT */
(function( $ ) {

function modifier( fn ) {
	return function() {
		var previous = this.element.val();
		fn.apply( this, arguments );
		this._refresh();
		if ( previous !== this.element.val() ) {
			this._trigger( "change" );
		}
	};
}

$.widget( "ui.spinner", {
	version: "1.1.1",
	defaultElement: "<input>",
	widgetEventPrefix: "spin",
	options: {
		culture: null,
		alignment: 'right',
		icons: {
			down: "ui-icon-triangle-1-s",
			up: "ui-icon-triangle-1-n",
			left: "ui-icon-triangle-1-w",
			right: "ui-icon-triangle-1-e"
		},
		incremental: true,
		max: null,
		min: null,
		numberFormat: null,
		page: 10,
		step: 1,

		change: null,
		spin: null,
		start: null,
		stop: null
	},

	_create: function() {
		// handle string values that need to be parsed
		this._setOption( "max", this.options.max );
		this._setOption( "min", this.options.min );
		this._setOption( "step", this.options.step );

		// format the value, but don't constrain
		this._value( this.element.val(), true );

		this._draw();
		this._on( this._events );
		this._refresh();

		// turning off autocomplete prevents the browser from remembering the
		// value when navigating through history, so we re-enable autocomplete
		// if the page is unloaded before the widget is destroyed. #7790
		this._on( this.window, {
			beforeunload: function() {
				this.element.removeAttr( "autocomplete" );
			}
		});
	},

	_getCreateOptions: function() {
		var options = {},
			element = this.element;

		$.each( [ "min", "max", "step" ], function( i, option ) {
			var value = element.attr( option );
			if ( value !== undefined && value.length ) {
				options[ option ] = value;
			}
		});

		return options;
	},

	_events: {
		keydown: function( event ) {
			if ( this._start( event ) && this._keydown( event ) ) {
				event.preventDefault();
			}
		},
		keyup: "_stop",
		focus: function() {
			this.previous = this.element.val();
		},
		blur: function( event ) {
			if ( this.cancelBlur ) {
				delete this.cancelBlur;
				return;
			}

			this._stop();
			this._refresh();
			if ( this.previous !== this.element.val() ) {
				this._trigger( "change", event );
			}
		},
		mousewheel: function( event, delta ) {
			if ( !delta ) {
				return;
			}
			if ( !this.spinning && !this._start( event ) ) {
				return false;
			}

			this._spin( (delta > 0 ? 1 : -1) * this.options.step, event );
			clearTimeout( this.mousewheelTimer );
			this.mousewheelTimer = this._delay(function() {
				if ( this.spinning ) {
					this._stop( event );
				}
			}, 100 );
			event.preventDefault();
		},
		"mousedown .ui-spinner-button": function( event ) {
			var previous;

			// We never want the buttons to have focus; whenever the user is
			// interacting with the spinner, the focus should be on the input.
			// If the input is focused then this.previous is properly set from
			// when the input first received focus. If the input is not focused
			// then we need to set this.previous based on the value before spinning.
			previous = this.element[0] === this.document[0].activeElement ?
				this.previous : this.element.val();
			function checkFocus() {
				var isActive = this.element[0] === this.document[0].activeElement;
				if ( !isActive ) {
					this.element.focus();
					this.previous = previous;
					// support: IE
					// IE sets focus asynchronously, so we need to check if focus
					// moved off of the input because the user clicked on the button.
					this._delay(function() {
						this.previous = previous;
					});
				}
			}

			// ensure focus is on (or stays on) the text field
			event.preventDefault();
			checkFocus.call( this );

			// support: IE
			// IE doesn't prevent moving focus even with event.preventDefault()
			// so we set a flag to know when we should ignore the blur event
			// and check (again) if focus moved off of the input.
			this.cancelBlur = true;
			this._delay(function() {
				delete this.cancelBlur;
				checkFocus.call( this );
			});

			if ( this._start( event ) === false ) {
				return;
			}

			this._repeat( null, $( event.currentTarget ).hasClass( "ui-spinner-up" ) ? 1 : -1, event );
		},
		"mouseup .ui-spinner-button": "_stop",
		"mouseenter .ui-spinner-button": function( event ) {
			// button will add ui-state-active if mouse was down while mouseleave and kept down
			if ( !$( event.currentTarget ).hasClass( "ui-state-active" ) ) {
				return;
			}

			if ( this._start( event ) === false ) {
				return false;
			}
			this._repeat( null, $( event.currentTarget ).hasClass( "ui-spinner-up" ) ? 1 : -1, event );
		},
		// TODO: do we really want to consider this a stop?
		// shouldn't we just stop the repeater and wait until mouseup before
		// we trigger the stop event?
		"mouseleave .ui-spinner-button": "_stop"
	},

	_draw: function() {
		var uiSpinner = this.uiSpinner = this.element
			.addClass( "ui-spinner-input" )
			.attr( "autocomplete", "off" )
			.wrap( this._uiSpinnerHtml() )
			.parent()
				.addClass( "ui-spinner-" + this.options.alignment )
				// add buttons
				.append( this._buttonHtml() );

		this.element.attr( "role", "spinbutton" );

		// button bindings
		this.buttons = uiSpinner.find( ".ui-spinner-button" )
			.attr( "tabIndex", -1 )
			.button()
			.removeClass( "ui-corner-all" );

		// IE 6 doesn't understand height: 50% for the buttons
		// unless the wrapper has an explicit height
		if ( this.buttons.height() > Math.ceil( uiSpinner.height() * 0.5 ) &&
				uiSpinner.height() > 0 ) {
			uiSpinner.height( uiSpinner.height() );
		}

		// disable spinner if element was already disabled
		if ( this.options.disabled ) {
			this.disable();
		}
	},

	_keydown: function( event ) {
		var options = this.options,
			keyCode = $.ui.keyCode;

		switch ( event.keyCode ) {
		case keyCode.UP:
			this._repeat( null, 1, event );
			return true;
		case keyCode.DOWN:
			this._repeat( null, -1, event );
			return true;
		case keyCode.PAGE_UP:
			this._repeat( null, options.page, event );
			return true;
		case keyCode.PAGE_DOWN:
			this._repeat( null, -options.page, event );
			return true;
		}

		return false;
	},

	_uiSpinnerHtml: function() {
		return "<span class='ui-spinner ui-widget ui-widget-content ui-corner-all'></span>";
	},

	_buttonHtml: function() {

		switch (this.options.alignment) {
		case 'right':
			return "" +
				"<a class='ui-spinner-button ui-spinner-up ui-corner-tr'>" +
					"<span class='ui-icon " + this.options.icons.up + "'>&#9650;</span>" +
				"</a>" +
				"<a class='ui-spinner-button ui-spinner-down ui-corner-br'>" +
					"<span class='ui-icon " + this.options.icons.down + "'>&#9660;</span>" +
				"</a>";
		case 'left':
			return "" +
				"<a class='ui-spinner-button ui-spinner-up ui-corner-tl'>" +
					"<span class='ui-icon " + this.options.icons.up + "'>&#9650;</span>" +
				"</a>" +
				"<a class='ui-spinner-button ui-spinner-down ui-corner-bl'>" +
					"<span class='ui-icon " + this.options.icons.down + "'>&#9660;</span>" +
				"</a>";
		case 'vertical':
			return "" +
				"<a class='ui-spinner-button ui-spinner-up ui-corner-top'>" +
					"<span class='ui-icon " + this.options.icons.up + "'>&#9650;</span>" +
				"</a>" +
				"<a class='ui-spinner-button ui-spinner-down ui-corner-bottom'>" +
					"<span class='ui-icon " + this.options.icons.down + "'>&#9660;</span>" +
				"</a>";
		case 'horizontal':
			return "" +
				"<a class='ui-spinner-button ui-spinner-up ui-corner-right'>" +
					"<span class='ui-icon " + this.options.icons.right + "'>&#9658;</span>" +
				"</a>" +
				"<a class='ui-spinner-button ui-spinner-down ui-corner-left'>" +
					"<span class='ui-icon " + this.options.icons.left + "'>&#9668;</span>" +
				"</a>";
		}
	},

	_start: function( event ) {
		if ( !this.spinning && this._trigger( "start", event ) === false ) {
			return false;
		}

		if ( !this.counter ) {
			this.counter = 1;
		}
		this.spinning = true;
		return true;
	},

	_repeat: function( i, steps, event ) {
		i = i || 500;

		clearTimeout( this.timer );
		this.timer = this._delay(function() {
			this._repeat( 40, steps, event );
		}, i );

		this._spin( steps * this.options.step, event );
	},

	_spin: function( step, event ) {
		var value = this.value() || 0;

		if ( !this.counter ) {
			this.counter = 1;
		}

		value = this._adjustValue( value + step * this._increment( this.counter ) );

		if ( !this.spinning || this._trigger( "spin", event, { value: value } ) !== false) {
			this._value( value );
			this.counter++;
		}
	},

	_increment: function( i ) {
		var incremental = this.options.incremental;

		if ( incremental ) {
			return $.isFunction( incremental ) ?
				incremental( i ) :
				Math.floor( i*i*i/50000 - i*i/500 + 17*i/200 + 1 );
		}

		return 1;
	},

	_precision: function() {
		var precision = this._precisionOf( this.options.step );
		if ( this.options.min !== null ) {
			precision = Math.max( precision, this._precisionOf( this.options.min ) );
		}
		return precision;
	},

	_precisionOf: function( num ) {
		var str = num.toString(),
			decimal = str.indexOf( "." );
		return decimal === -1 ? 0 : str.length - decimal - 1;
	},

	_adjustValue: function( value ) {
		var base, aboveMin,
			options = this.options;

		// make sure we're at a valid step
		// - find out where we are relative to the base (min or 0)
		base = options.min !== null ? options.min : 0;
		aboveMin = value - base;
		// - round to the nearest step
		aboveMin = Math.round(aboveMin / options.step) * options.step;
		// - rounding is based on 0, so adjust back to our base
		value = base + aboveMin;

		// fix precision from bad JS floating point math
		value = parseFloat( value.toFixed( this._precision() ) );

		// clamp the value
		if ( options.max !== null && value > options.max) {
			return options.max;
		}
		if ( options.min !== null && value < options.min ) {
			return options.min;
		}

		return value;
	},

	_stop: function( event ) {
		if ( !this.spinning ) {
			return;
		}

		clearTimeout( this.timer );
		clearTimeout( this.mousewheelTimer );
		this.counter = 0;
		this.spinning = false;
		this._trigger( "stop", event );
	},

	_setOption: function( key, value ) {
		if ( key === "culture" || key === "numberFormat" ) {
			var prevValue = this._parse( this.element.val() );
			this.options[ key ] = value;
			this.element.val( this._format( prevValue ) );
			return;
		}

		if ( key === "max" || key === "min" || key === "step" ) {
			if ( typeof value === "string" ) {
				value = this._parse( value );
			}
		}
		if ( key === "icons" ) {
			if ( this.options.alignment == 'horizontal' ) {

				this.buttons.first().find( ".ui-icon" )
					.removeClass( this.options.icons.left )
					.addClass( value.left );
				this.buttons.last().find( ".ui-icon" )
					.removeClass( this.options.icons.right )
					.addClass( value.right );

			} else {

				this.buttons.first().find( ".ui-icon" )
					.removeClass( this.options.icons.up )
					.addClass( value.up );
				this.buttons.last().find( ".ui-icon" )
					.removeClass( this.options.icons.down )
					.addClass( value.down );

			}
		}

		this._super( key, value );

		if ( key === "disabled" ) {
			this.widget().toggleClass( "ui-state-disabled", !!value );
			this.element.prop( "disabled", !!value );
			this.buttons.button( value ? "disable" : "enable" );
		}
	},

	_setOptions: modifier(function( options ) {
		this._super( options );
		this._value( this.element.val() );
	}),

	_parse: function( val ) {
		if ( typeof val === "string" && val !== "" ) {
			val = window.Globalize && this.options.numberFormat ?
				Globalize.parseFloat( val, 10, this.options.culture ) : +val;
		}
		return val === "" || isNaN( val ) ? null : val;
	},

	_format: function( value ) {
		if ( value === "" ) {
			return "";
		}
		return window.Globalize && this.options.numberFormat ?
			Globalize.format( value, this.options.numberFormat, this.options.culture ) :
			value;
	},

	_refresh: function() {
		this.element.attr({
			"aria-valuemin": this.options.min,
			"aria-valuemax": this.options.max,
			// TODO: what should we do with values that can't be parsed?
			"aria-valuenow": this._parse( this.element.val() )
		});
	},

	// update the value without triggering change
	_value: function( value, allowAny ) {
		var parsed;
		if ( value !== "" ) {
			parsed = this._parse( value );
			if ( parsed !== null ) {
				if ( !allowAny ) {
					parsed = this._adjustValue( parsed );
				}
				value = this._format( parsed );
			}
		}
		this.element.val( value );
		this._refresh();
	},

	_destroy: function() {
		this.element
			.removeClass( "ui-spinner-input" )
			.prop( "disabled", false )
			.removeAttr( "autocomplete" )
			.removeAttr( "role" )
			.removeAttr( "aria-valuemin" )
			.removeAttr( "aria-valuemax" )
			.removeAttr( "aria-valuenow" );
		this.uiSpinner.replaceWith( this.element );
	},

	stepUp: modifier(function( steps ) {
		this._stepUp( steps );
	}),
	_stepUp: function( steps ) {
		if ( this._start() ) {
			this._spin( (steps || 1) * this.options.step );
			this._stop();
		}
	},

	stepDown: modifier(function( steps ) {
		this._stepDown( steps );
	}),
	_stepDown: function( steps ) {
		if ( this._start() ) {
			this._spin( (steps || 1) * -this.options.step );
			this._stop();
		}
	},

	pageUp: modifier(function( pages ) {
		this._stepUp( (pages || 1) * this.options.page );
	}),

	pageDown: modifier(function( pages ) {
		this._stepDown( (pages || 1) * this.options.page );
	}),

	value: function( newVal ) {
		if ( !arguments.length ) {
			return this._parse( this.element.val() );
		}
		modifier( this._value ).call( this, newVal );
	},

	widget: function() {
		return this.uiSpinner;
	}
});

}( jQuery ) );

(function( $, undefined ) {

   $.widget( "ui.combobox", {

      version: "1.1.1",

      widgetEventPrefix: "combobox",

      uiCombo: null,
      uiInput: null,
      _wasOpen: false,

      _create: function() {

         var self = this,
             select = this.element.hide(),
             input, wrapper;

         input = this.uiInput =
                  $( "<input />" )
                      .insertAfter(select)
                      .addClass("ui-widget ui-widget-content ui-corner-left ui-combobox-input")
                      .val( select.children(':selected').text() )
                      .attr('tabindex', select.attr( 'tabindex'));

         wrapper = this.uiCombo =
            input.wrap( '<span>' )
               .parent()
               .addClass( 'ui-combobox' )
               .insertAfter( select );

         input
          .autocomplete({

             delay: 0,
             minLength: 0,

             appendTo: wrapper,
             source: $.proxy( this, "_linkSelectList" )

          });

         $( "<button>" )
            .attr( "tabIndex", -1 )
            .attr( "type", "button" )
            .insertAfter( input )
            .button({
               icons: {
                  primary: "ui-icon-triangle-1-s"
               },
               text: false
            })
            .removeClass( "ui-corner-all" )
            .addClass( "ui-corner-right ui-button-icon ui-combobox-button" );


         // Our items have HTML tags.  The default rendering uses text()
         // to set the content of the <a> tag.  We need html().
         input.data( "ui-autocomplete" )._renderItem = function( ul, item ) {

               return $( "<li>" )
                           .append( $( "<a>" ).html( item.label ) )
                           .appendTo( ul );

            };

         this._on( this._events );

      },


      _linkSelectList: function( request, response ) {

         var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), 'i' );
         response( this.element.children('option').map(function() {
                  var text = $( this ).text();

                  if ( this.value && ( !request.term || matcher.test(text) ) ) {
                     var optionData = {
                         label: text,
                         value: text,
                         option: this
                     };
                     if (request.term) {
                        optionData.label = text.replace(
                           new RegExp(
                              "(?![^&;]+;)(?!<[^<>]*)(" +
                              $.ui.autocomplete.escapeRegex(request.term) +
                              ")(?![^<>]*>)(?![^&;]+;)", "gi"),
                              "<strong>$1</strong>");
                    }
                    return optionData;
                  }
              })
           );
      },

      _events: {

         "autocompletechange input" : function(event, ui) {

            var $el = $(event.currentTarget);
            var changedOption = ui.item ? ui.item.option : null;
            if ( !ui.item ) {

               var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( $el.val() ) + "$", "i" ),
               valid = false,
               matchContains = null,
               iContains = 0,
               iSelectCtr = -1,
               iSelected = -1,
               optContains = null;
               if (this.options.autofillsinglematch) {
                  matchContains = new RegExp($.ui.autocomplete.escapeRegex($el.val()), "i");
               }


               this.element.children( "option" ).each(function() {
                     var t = $(this).text();
                     if ( t.match( matcher ) ) {
                        this.selected = valid = true;
                        return false;
                     }
                     if (matchContains) {
                        // look for items containing the value
                        iSelectCtr++;
                        if (t.match(matchContains)) {
                           iContains++;
                           optContains = $(this);
                           iSelected = iSelectCtr;
                        }
                     }
                  });

                if ( !valid ) {
                   // autofill option:  if there is just one match, then select the matched option
                   if (iContains == 1) {
                      changedOption = optContains[0];
                      changedOption.selected = true;
                      var t2 = optContains.text();
                      $el.val(t2);
                      $el.data('ui-autocomplete').term = t2;
                      this.element.prop('selectedIndex', iSelected);
                      console.log("Found single match with '" + t2 + "'");
                   } else {

                      // remove invalid value, as it didn't match anything
                      $el.val( '' );

                      // Internally, term must change before another search is performed
                      // if the same search is performed again, the menu won't be shown
                      // because the value didn't actually change via a keyboard event
                      $el.data( 'ui-autocomplete' ).term = '';

                      this.element.prop('selectedIndex', -1);
                   }
                }
            }

            this._trigger( "change", event, {
                  item: changedOption
                });

         },

         "autocompleteselect input": function( event, ui ) {

            ui.item.option.selected = true;
            this._trigger( "select", event, {
                  item: ui.item.option
               });

         },

         "autocompleteopen input": function ( event, ui ) {

            this.uiCombo.children('.ui-autocomplete')
               .outerWidth(this.uiCombo.outerWidth(true));
         },

         "mousedown .ui-combobox-button" : function ( event ) {
            this._wasOpen = this.uiInput.autocomplete("widget").is(":visible");
         },

         "click .ui-combobox-button" : function( event ) {

            this.uiInput.focus();

            // close if already visible
            if (this._wasOpen)
               return;

            // pass empty string as value to search for, displaying all results
            this.uiInput.autocomplete("search", "");

         }

      },

      value: function ( newVal ) {
         var select = this.element,
             valid = false,
             selected;

         if ( !arguments.length ) {
            selected = select.children( ":selected" );
            return selected.length > 0 ? selected.val() : null;
         }

         select.prop('selectedIndex', -1);
         select.children('option').each(function() {
               if ( this.value == newVal ) {
                  this.selected = valid = true;
                  return false;
               }
            });

         if ( valid ) {
            this.uiInput.val(select.children(':selected').text());
         } else {
            this.uiInput.val( "" );
            this.element.prop('selectedIndex', -1);
         }

      },

      _destroy: function () {
         this.element.show();
         this.uiCombo.replaceWith( this.element );
      },

      widget: function () {
         return this.uiCombo;
      },

      _getCreateEventData: function() {

         return {
            select: this.element,
            combo: this.uiCombo,
            input: this.uiInput
         };
      }

    });


}(jQuery));

(function( $, undefined ) {


    $.widget( "ui.labeledslider", $.ui.slider, {

      version: "1.1.1",

      options: {
         tickInterval: 0,
         tweenLabels: true,
         tickLabels: null,
         tickArray: []
      },

      uiSlider: null,
      tickInterval: 0,
      tweenLabels: true,

      _create: function( ) {

         this._detectOrientation();

         this.uiSlider =
             this.element
                .wrap( '<div class="ui-slider-wrapper ui-widget"></div>' )
                .before( '<div class="ui-slider-labels">' )
                .parent()
                .addClass( this.orientation )
                .css( 'font-size', this.element.css('font-size') );

         this._super();

         this.element.removeClass( 'ui-widget' )

         this._alignWithStep();

         if ( this.orientation == 'horizontal' ) {
            this.uiSlider
               .width( this.element.css('width') );
         } else {
            this.uiSlider
               .height( this.element.css('height') );
         }

         this._drawLabels();
      },

      _drawLabels: function () {

         var labels = this.options.tickLabels || {},
             $lbl = this.uiSlider.children( '.ui-slider-labels' ),
             dir = this.orientation == 'horizontal' ? 'left' : 'bottom',
             min = this.options.min,
             max = this.options.max,
             inr = this.tickInterval,
             cnt = ( max - min ),
             tickArray = this.options.tickArray,
             ta = tickArray.length > 0,
             label, pt,
             i = 0;

         $lbl.html('');

         for (;i<=cnt;i++) {

            if ( ( !ta && i%inr == 0 ) || ( ta && tickArray.indexOf( i+min ) > -1 ) ) {

               label = labels[i+min] ? labels[i+min] : (this.options.tweenLabels ? i+min : '');

               $('<div>').addClass( 'ui-slider-label-ticks' )
                   .css( dir, (Math.round( ( i / cnt ) * 10000 ) / 100) + '%' )
                   .html( '<span>'+( label )+'</span>' )
                   .appendTo( $lbl );

            }
         }

      },

      _setOption: function( key, value ) {

          this._super( key, value );

          switch ( key ) {

             case 'tickInterval':
             case 'tickLabels':
             case 'tickArray':
             case 'min':
             case 'max':
             case 'step':

                this._alignWithStep();
                this._drawLabels();
                break;

             case 'orientation':

                this.element
                   .removeClass( 'horizontal vertical' )
                   .addClass( this.orientation );

                this._drawLabels();
                break;
          }
       },

       _alignWithStep: function () {
          if ( this.options.tickInterval < this.options.step )
            this.tickInterval = this.options.step;
          else
            this.tickInterval = this.options.tickInterval;
       },

       _destroy: function() {
          this._super();
          this.uiSlider.replaceWith( this.element );
       },

       widget: function() {
          return this.uiSlider;
       }

   });

}(jQuery));

(function( $ ) {

$.widget( "ui.slidespinner", $.ui.spinner, {

   version: "1.1.1",

   widgetEventPrefix: "slidespinner",

   options: {
      alignment: 'vertical',
      min: 0,
      max: 100,
   },

   _create: function() {

      this.options.min = this.options.min || 0;
      this.options.max = this.options.max || 100;

      if ( this.options.alignment != 'vertical' &&
            this.options.alignment != 'horizontal' ) {
         this.options.alignment = 'vertical';
      }

      this._super();

      this._value( this.element.val() );
      this.uiSlider.slider( 'value', this.value() | 0 );
   },

   _draw: function( ) {

      var self = this,
          options = this.options;

      this._super();

      this.uiWrapper =
         this.uiSpinner
            .wrap( '<span>' )
            .parent()
            .addClass( 'ui-slidespinner' );

      this.uiSlider =
         $('<div>')
            .appendTo( this.uiWrapper )
            .slider({
                  orientation: options.alignment,
                  min: options.min,
                  max: options.max,
                  slide: function (e, ui) {
                     self._value( ui.value );
                  }
               });

      if ( options.alignment == 'vertical' ) {
         this.uiSlider
            .position({ my: 'left+5 top+5', at: 'right top', of: this.uiSpinner })
            .css( 'height', this.uiSpinner.outerHeight(true) - 10 );
      } else {
         this.uiSlider
            .position({ my: 'left+5 top+5', at: 'left bottom', of: this.uiSpinner })
            .css( 'width', this.uiSpinner.outerWidth(true) - 10 );
      }
   },

   _spin: function( step, event ) {

      this._super( step, event );

      this.uiSlider.slider( 'value', this.value() | 0 );
   },

   _stop: function( event ) {

      if ( event.type == 'keyup'  ) {
         this.uiSlider.slider( 'value', this.value() | 0 );
      }

      this._super( event );
  },

   _destroy: function( ) {

      this.uiSlider.remove();
      this.uiSpinner.unwrap();

      this._super();
   }

});

}( jQuery ) );

(function ($) {
   "use strict";

    var _base_stop = $.ui.spinner.prototype._stop;
    $.ui.spinner.prototype._stop = function( event ) {

         var value = this.value() || 0;

         if (event && event.type == 'keyup' && value != this._adjustValue(value) ) {
            this.value(this.previous);
            this._trigger( "invalid", event );
         } else {
            this.previous=value;
            this.element.val(this._format(value));
         }

         _base_stop.call( this, event );
      }

    $.widget( "ui.paddedspinner", $.ui.spinner, {
        widgetEventPrefix: "spin",
        options: {
           padCount: 2,
           padString: '0'
        },

        _parse: function( value ) {
            return +value;
        },

        _format: function( value ) {
            var str = value+'';
            while ( str.length < this.options.padCount )
               str = this.options.padString + str;
            return str;
        },

    });

    $.widget( "ui.ampmspinner", $.ui.spinner, {
        widgetEventPrefix: "spin",
        options: {
           max: 1,
           min: 0,
           alignment: 'vertical'
        },

        _parse: function( value ) {

            if ( typeof value === "string" ) {
                return value == 'AM' ? 0 : 1;
            }
            return value;
        },

        _format: function( value ) {
            return value === 0 ? 'AM' : 'PM';
        },

    });

   $.widget('osb.timepicker', {

      version: "1.1.1",

      widgetEventPrefix: 'timepicker',

      options: {
         format: 'hh:mm A'
      },

      _init: function () {

         var self = this,
             html = '<input class="ui-timepicker-hour"/><span style="font-size: 1.4em">:</span><input class="ui-timepicker-minute"/>';

         this.hour24 = ( this.options.format.indexOf( 'HH' ) > -1 );

         if ( !this.hour24 )
            html += ' <input class="ui-timepicker-ampm"/>';

         this.element.empty().html( html );

         this.$hour = this.element.children( '.ui-timepicker-hour' ).paddedspinner({
            alignment: 'vertical',
            min: this.hour24 ? -1 : 0,
            max: this.hour24 ? 24 : 13,
            spin: function( e, ui ) {

               var ampm,
                   val = +ui.value,
                   min = self.hour24 ? -1 : 0,
                   max = self.hour24 ? 24 : 13;

               if ( val <= min || val >= max ) {

                  if ( val <= min ) self.$hour.paddedspinner( 'value', max - 1 );
                  if ( val >= max ) self.$hour.paddedspinner( 'value', min + 1 );

                  if ( !self.hour24 ) {
                     ampm = self.$ampm.ampmspinner( 'value' );
                     self.$ampm.ampmspinner( 'value', ampm == 0 ? 1 : 0 );
                  }

                  self._trigger( 'change', self._value() );

                  return false;
               }

               self._trigger( 'change', self._value() );
            },
            stop: function() {

               var val = +self.$hour.val(),
                   min = self.hour24 ? -1 : 0,
                   max = self.hour24 ? 24 : 13;

               if ( val <= min || val >= max ) {
                  self.$hour.val('')
               }

               self._ensureValue();
            }
         });

         this.$minute = this.element.children( '.ui-timepicker-minute' ).paddedspinner({
            alignment: 'vertical',
            min: -1,
            max: 60,
            spin: function( e, ui ) {

               var hour, val = +ui.value;

               if ( val <= -1 || val >= 60 ) {

                  if ( val <= -1 ) self.$minute.paddedspinner( 'value', 59 );
                  if ( val >= 60 ) self.$minute.paddedspinner( 'value', 0 );

                  hour = self.$hour.paddedspinner( 'value' );
                  hour = val == -1 ? hour -1 : hour + 1;
                  self.$hour
                     .paddedspinner( 'value', hour )
                     .data( 'ui-paddedspinner' )._trigger( 'spin', e, { value: hour } );

                  self._trigger( 'change', self._value() );

                  return false;
               }

               self._trigger( 'change', self._value() );
            },
            stop: function() {

               var val = +self.$minute.val();

               if ( val == -1 || val == 60 ) {
                  self.$hour.val('');
               }

               self._ensureValue();

            }
         });

         if ( !this.hour24 ) {

            this.$ampm = this.element.children( '.ui-timepicker-ampm' ).ampmspinner({
               spin: function() {

                  self._trigger( 'change', self._value() );
                  self._ensureValue();
               }
            });

         }

         this._on( this._events );
      },

      _events: {

         'click input': function( e ) {

            var $target = $( e.currentTarget );

            $target.select();
         }
      },

      _destroy: function () {
         this.element.empty();
      },

      _value: function() {
         var hour = +this.$hour.val(),
             min = +this.$minute.val(),
             ampm = this.hour24 ? '' : this.$ampm.val(),
             val;

         if ( window.moment ) {

            hour = ( ampm == 'PM' && hour < 12 ? hour + 12 : hour );
            val = moment({ hour: hour, minute: min });

         } else {

            val = hour + ':' + min;
            if ( !this.hour24 )
               val += ' ' + ampm;
         }

         return val;
      },

      _parse: function( val ) {

         var tm, parts,
             hour, min, ampm;

         if ( window.moment ) {

            if ( val instanceof Date )
               tm = moment( val );
            else
               tm = moment( val, this.options.format );

            if ( !tm.isValid() ) return;

            hour = tm.hour();
            min = tm.minute();

            if ( !this.hour24 ) {
               ampm = hour >= 12 ? 'PM' : 'AM';
               hour = hour > 12 ? hour - 12 : hour
            }

         } else {

            parts = val.split( /[: ]/ );
            if ( parts.length < 2 ) return;

            hour = parts[0];
            min = parts[1];

            if ( !this.hour24 ) {
               ampm = parts[2] || 'AM';
            }
         }

         this.$hour.paddedspinner( 'value', +hour );
         this.$minute.paddedspinner( 'value', +min );

         if ( !this.hour24 ) {
            this.$ampm.ampmspinner( 'value', ampm == 'AM' ? 0 : 1 );
         }
      },

      _ensureValue: function() {
         var dt = new Date(),
             hour = this.$hour.val(),
             min = this.$minute.val(),
             ampm = this.hour24 ? '' : this.$ampm.val();

         if ( !hour ) this.$hour.paddedspinner( 'value', ( hour = dt.getHours() ) > 12 ? hour - 12 : hour );
         if ( !min ) this.$minute.paddedspinner( 'value',  dt.getMinutes() );

         if ( !this.hour24 ) {
            if ( !ampm ) this.$ampm.ampmspinner( 'value',  dt.getHours() > 12 ? 'PM' : 'AM' );
         }
      },

      value: function( val ) {

         if ( typeof( val ) == 'undefined' )
            return this._value();
         else
            this._parse( val );

      }

   });

})(jQuery);
(function ( $, undefined ) {
    $.widget( "ui.waitbutton", $.ui.button, {

       version: "1.1.1",

       // Keep button prefix instead of waitbutton
       // otherwise waiting event is waitbuttonwaiting
       // which is weird.
       widgetEventPrefix: "button",

       options: {
          waitLabel: null,
          waitIcon: 'ui-icon-waiting'
       },

       _saved: null,

       _create: function() {

          this._super();

          this.element.addClass('ui-wait-button');
          this._saved = {};

          this._saveOptions();

       },

       _init: function() {

          this._super();

          this.disable();
          this._toggleWaitState();
          this._initWaitClick();

       },

       _initWaitClick: function() {

          /**
          *   channel clicks through waiting event instead
          *   base button does not listen to click -
          *   it listens to mousedown/up.  This prevents any external
          *   listeners from firing when we want to use the callback
          *   provided by the waiting event.
          */
          this.element.off( 'click' );

          this.element.one( 'click', $.proxy( this, '_toggleWaitState' ) );
       },

       _toggleWaitState: function() {

          var event;

          if ( this.options.disabled ) {

             this._setOptions({
                disabled: false,
                label: this._saved.label,
                icons: { primary: this._saved.icon }
             });

          } else {

             this._saveOptions();

             this._setOptions({
                disabled: true,
                label: this.options.waitLabel || this.options.label,
                icons: { primary: this.options.waitIcon }
             });

             event = arguments[0] || (new jQuery.Event( 'click', { target: this.element } ) );

             /* channel clicks through waiting event instead */
             event.preventDefault();
             event.stopPropagation();
             event.stopImmediatePropagation();

             this._trigger( 'waiting', event, { done: $.proxy( this, '_waitComplete' ) } );
          }

       },

       _waitComplete: function() {

          // Juggle arguments
          var label = (arguments[0] && typeof( arguments[0] ) == 'string' ? arguments[0] : null),
              enable = (label ? arguments[1] : arguments[0]);

          // Determine next state - either return to start or
          // use a different label and/or leave in disabled state

          if ( typeof( enable ) == 'undefined' ) enable = true;

          this._toggleWaitState();
          if ( enable ) {
             this._initWaitClick();
          } else {
             this.disable();
          }

          if ( label ) {
             this._setOption( 'label', label );
          }
       },

       _saveOptions: function() {

          this._saved.icon = this.options.icons.primary;
          this._saved.label = this.options.label;

       }

    });

})(jQuery);
