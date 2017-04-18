function a11yController() {
    this.runButton = document.querySelector('#run')
    this.banner = document.getElementById('top')
    this.blockPalette = document.querySelector('.droplet-palette-wrapper')
    this.bannerBtnContainer = document.querySelector('#topright')
    this.bannerBtns = this.bannerBtnContainer.querySelectorAll("#save, #screenshot, #share, #login, #help, #guide, #splitscreen")    
    this.blockEditor = document.querySelector('.droplet-wrapper-div')
    this.blockToggle = document.querySelector('.blocktoggle')
    this.textToggle = document.querySelector('.texttoggle')
    
    this.init();
    this.addARIAattributes(); 
}

//give elements the proper aria attributes
a11yController.prototype.addARIAattributes = function () {
    //run button label
    this.runButton.setAttribute('aria-label', 'run program') //TODO: bug where run button is recreated on toggle

    //add labels to banner buttons
    this.bannerBtns.forEach(function(element) {
        element.setAttribute('aria-label', element.id);
    }, this);

    //block palette
    this.blockPalette.setAttribute('role', 'region')
    this.blockPalette.setAttribute('aria-label', 'block palette')

    //block editor
    this.blockEditor.setAttribute('role', 'region')
    this.blockEditor.setAttribute('aria-label', 'block editor')

    //editor mode toggle (they made two of them for some reason)
    this.blockToggle.setAttribute('role', 'button')
    this.textToggle.setAttribute('role', 'button')
}

//remove focus from elements that shouldn't have focus
a11yController.prototype.init = function () {
    //remove iframes from tab index
    var iframes = document.querySelectorAll('iframe');    
    iframes.forEach(function(element) {        
        element.setAttribute("tabindex", -1);
    }, this);
    
    //an attemp to remove focus from the text editor on load
    //this allows the user to reach the skip to editor link after hitting tab once
    document.querySelector('.droplet-main-canvas').setAttribute('id', 'code-editor-canvas')
    document.querySelector('.droplet-main-canvas').setAttribute('tabindex', 0)
    document.querySelector('.droplet-hidden-input').setAttribute('tabindex', -1)
    var textInput = document.querySelector('.ace_text-input')
    textInput.addEventListener("focus", initFocus);
    textInput.blur();
    textInput.focus();
    function initFocus() {
        console.log('focused');
        console.log(document.getElementById('focus-guide'))
        document.getElementById('focus-guide').focus()
        textInput.removeEventListener("focus", initFocus)
    }
}

//old code left for reference
a11yController.prototype.tabController = function (event) {
    if(event.keyCode == 9) {
        //SHIFT + TAB 
        if(event.shiftKey) {            
            //event.preventDefault();
        } else {
            if(document.activeElement == document.body) {
                event.preventDefault();
                document.querySelector(".skip").focus();
            }
        }      
    }
    //ESC key
    if(event.keyCode == 27) {
        console.log('registered esc key');
    }
}

//old code left for reference
a11yController.prototype.setupPrimaryNav = function () {
    //main ui sections
    var blockEditor = document.querySelector('.droplet-main-scroller')
    var blockCategory = document.querySelector('.droplet-palette-header')    
    var runButton = document.querySelector('#run')

    //console exists in seperate iframe, so get the scope of the iframe to select it
    var outputFrame = document.querySelector('#output-frame')
    var outputDocument = outputFrame.contentDocument || outputFrame.contentWindow.document    
    var consoleInput = outputDocument.querySelector('._log #_testinput') //select console

    //listed in navigation order
    const primaryNavSections = [
        blockEditor,
        blockCategory,
        runButton,
        consoleInput
    ]

    //remove tab index from primary navigation so we can handle this manually
    primaryNavSections.forEach(function(element) {
        element.setAttribute("tabindex", -1);
    })

    return primaryNavSections;
}

//bootstrap a11y enhancements after window loads
window.addEventListener('load', function load(event){
    window.removeEventListener('load', load, false);    
    var a11yEnhancement = new a11yController();
})