
module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      all: {
        files: {
          "src/dist/pencilcode-contextmenu.js": [
            "src/dev/pencilcode-contextmenu.js"
          ]
        },
        options: {
          preserveComments: false,
          screwIE8: true,
          report: 'min',
          beautify: {
            beautify: true
          }
        }
      }
    },
    less: {
      all: {
        options: { compress: true },
        files: {
          "src/dist/pencilcode-contextmenu.css": "src/dev/pencilcode-contextmenu.less"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');


  grunt.registerTask('build',['uglify', 'less']);
};

