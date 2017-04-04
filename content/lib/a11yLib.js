function _init() {
    document.activeElement.blur(); //set focus to body of view
    
    document.getElementsByClassName("droplet-wrapper-div")[0].setAttribute("id", "maincontent");    
    
    const primaryNavSections = setupPrimaryNav() //load primary nav sections
    console.log(primaryNavSections) 
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