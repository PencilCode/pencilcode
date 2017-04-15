function a11yController() {
    this.init();
    this.addARIAlabels();
}

a11yController.prototype.addARIAlabels = function () {
    //add labels to banner buttons
    var bannerBtnContainer = document.querySelector('#topright')
    var bannerBtns = bannerBtnContainer.querySelectorAll("#save, #screenshot, #share, #login, #help, #guide, #splitscreen")
    bannerBtns.forEach(function(element) {
        element.setAttribute('aria-label', element.id);
    }, this);
}

a11yController.prototype.init = function () {
    //remove iframes from tab index
    var iframes = document.querySelectorAll('iframe');    
    iframes.forEach(function(element) {        
        element.setAttribute("tabindex", -1);
    }, this);
    
    document.querySelector('.droplet-main-canvas').setAttribute('id', 'code-editor-canvas')
    document.querySelector('.droplet-main-canvas').setAttribute('tabindex', 0)

    document.activeElement.blur(); //set focus to body of view
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