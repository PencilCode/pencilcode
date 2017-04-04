function _init() {
    document.activeElement.blur(); //set focus to body of view    
    
    document.getElementsByClassName("droplet-wrapper-div")[0].setAttribute("id", "maincontent");
    // document.querySelector(".skip").setAttribute("tabindex", 0);
    
    //load primary nav sections
    const primaryNavSections = setupPrimaryNav();

    //remove iframes from tab index
    var iframes = document.querySelectorAll('iframe');    
    iframes.forEach(function(element) {        
        element.setAttribute("tabindex", -1);
    }, this);
    
    //remove tab index from primary navigation so we can handle this manually
    primaryNavSections.forEach(function(element) {
        element.setAttribute("tabindex", -1);
    })

    //intercept keyboard events
    document.addEventListener('keydown', function (event) {tabController(event)});
}

function tabController(event) {    
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
        console.log('closing overlay');
        closeoverlay();
    }
}

//create an array of primary navigation sections on the site
function setupPrimaryNav() {
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

    return primaryNavSections;
}

//bootstrap a11y enhancements after window loads
window.addEventListener('load', function load(event){
    window.removeEventListener('load', load, false);
    _init();
})