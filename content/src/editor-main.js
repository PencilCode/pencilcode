///////////////////////////////////////////////////////////////////////////
// REQUIRE JS path config
///////////////////////////////////////////////////////////////////////////
require.config({
  baseUrl: '/',
  paths: {
    'droplet': 'lib/droplet',
    'controller': 'src/controller',
    'view': 'src/view',
    'storage': 'src/storage',
    'debug': 'src/debug',
    'codescan': 'src/codescan',
    'palette': 'src/palette',
    'FontLoader': 'src/FontLoader',
    'filetype': 'src/filetype',
    'gadget': 'src/gadget',
    'draw-protractor': 'src/draw-protractor',
    'guide': 'src/guide',
    'jquery': 'lib/jquery',
    'jquery-ui': 'lib/jquery-ui',
    'jquery-ui-slider-pips': 'lib/jquery-ui-slider-pips',
    'iced-coffee-script': 'lib/iced-coffee-script',
    'pencil-tracer': 'lib/pencil-tracer',
    'see': 'lib/see',
    'seedrandom': 'lib/seedrandom',
    'sourcemap': 'lib/sourcemap',
    'tooltipster': 'lib/tooltipster/js/jquery.tooltipster',
    'ZeroClipboard': 'lib/zeroclipboard/ZeroClipboard'
  },
  shim: {
    'tooltipster': {
       deps: ['jquery'],
       exports: 'jQuery.fn.tooltipster'
    },
    'see': {
       deps: ['jquery'],
       exports: 'see'
    },
    'jquery-ui-slider-pips': {
       deps: ['jquery-ui'],
       exports: 'jQuery.ui.slider.pips'
    },
    
  }
});

///////////////////////////////////////////////////////////////////////////
// MAIN FUNCTION: INITIALIZATION DONE BY CONTROLLER
///////////////////////////////////////////////////////////////////////////

require([
  'controller'
],
function(controller) { });

