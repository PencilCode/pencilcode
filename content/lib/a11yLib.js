function _init() {        
    console.log('future home of a11y enhancements!')
    
    document.body.focus(); //ensure focus is within the page
    
    const primaryNavSections = setupPrimaryNav()      
    console.log(primaryNavSections) 
}

//create an array of primary navigation sections on the site
function setupPrimaryNav() {
    //main ui sections
    let blockEditor = document.querySelector('.droplet-main-scroller')
    let blockCategory = document.querySelector('.droplet-palette-header')    
    let runButton = document.querySelector('#run')

    //console exists in seperate iframe, so get the scope of the iframe to select it
    let outputFrame = document.querySelector('#output-frame')
    let outputDocument = outputFrame.contentDocument || outputFrame.contentWindow.document    
    let consoleInput = outputDocument.querySelector('._log #_testinput') //select console

    //listed in navigation order
    const primaryNavSections = [
        blockEditor,
        blockCategory,
        runButton,
        consoleInput
    ]

    return primaryNavSections;
}



window.addEventListener('load', () => _init())