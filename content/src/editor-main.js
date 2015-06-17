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
    'thumbnail': 'src/thumbnail',
    'debug': 'src/debug',
    'codescan': 'src/codescan',
    'palette': 'src/palette',
    'FontLoader': 'src/FontLoader',
    'filetype': 'src/filetype',
    'gadget': 'src/gadget',
    'draw-protractor': 'src/draw-protractor',
    'guide': 'src/guide',
    'jquery': 'lib/jquery',
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
    }
  }
});

///////////////////////////////////////////////////////////////////////////
// MAIN FUNCTION: INITIALIZATION DONE BY CONTROLLER
///////////////////////////////////////////////////////////////////////////

require([
  'controller'
],
function(controller) { });

