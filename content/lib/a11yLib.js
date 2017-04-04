function _init() {    
    console.log('future home of a11y enhancements!')
    document.getElementsByClassName("droplet-wrapper-div")[0].setAttribute("id", "maincontent");
}

window.addEventListener('load', () => _init())