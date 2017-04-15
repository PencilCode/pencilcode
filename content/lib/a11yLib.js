function a11yController() {
    this.init();
    this.addARIAattributes(); 
}

a11yController.prototype.addARIAattributes = function () {
    //run button label
    var runButton = document.querySelector('#run')
    runButton.setAttribute('aria-label', 'run program')
    
    //add labels to banner buttons
    var banner = document.getElementById('top')
    banner.setAttribute('role', 'banner')
    var bannerBtnContainer = document.querySelector('#topright')
    var bannerBtns = bannerBtnContainer.querySelectorAll("#save, #screenshot, #share, #login, #help, #guide, #splitscreen")
    bannerBtns.forEach(function(element) {
        element.setAttribute('aria-label', element.id);
    }, this);

    //block palette 
    var blockPalette = document.querySelector('.droplet-palette-element')
    blockPalette.setAttribute('role', 'region')
    blockPalette.setAttribute('aria-label', 'block palette')

    var blockEditor = document.querySelector('.droplet-main-scroller')
    blockEditor.setAttribute('role', 'region')
    blockPalette.setAttribute('aria-label', 'block editor')
}

a11yController.prototype.init = function () {
    //remove iframes from tab index
    var iframes = document.querySelectorAll('iframe');    
    iframes.forEach(function(element) {        
        element.setAttribute("tabindex", -1);
    }, this);
    
    document.querySelector('.droplet-main-canvas').setAttribute('id', 'code-editor-canvas')
    document.querySelector('.droplet-main-canvas').setAttribute('tabindex', 0)
    document.querySelector('.droplet-hidden-input').setAttribute('tabindex', -1)
    var textInput = document.querySelector('.ace_text-input')
    textInput.addEventListener("focus", function() {
        console.log('focused');
        document.querySelector('#run').focus()
    });

    console.log(textInput)
    textInput.blur();
    textInput.focus();
}

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