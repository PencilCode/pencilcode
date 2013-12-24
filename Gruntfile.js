module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    bowercopy: {
      options: {
        clean: true
      },
      test: {
        options: {
          destPrefix: "test/lib"
        },
        files: {
          "qunit.js" : "qunit/qunit/qunit.js",
          "qunit.css" : "qunit/qunit/qunit.css",
          "jquery.js" : "jquery/index.js",
        }
      },
      top: {
        options: {
          destPrefix: "site/top"
        },
        files: {
          "jquery.js" : "jquery/index.js",
          "iced-coffee-script.js": "iced-coffee-script/extras/coffee-script.js",
          "jquery-turtle.js": "jquery-turtle/jquery-turtle.js",
          "underscore.js": "underscore/underscore.js"
        }
      }
    },
    uglify: {
      all: {
        files: {
          "site/top/turtlebits.js": [
            "site/top/iced-coffee-script.js",
            "site/top/jquery.js",
            "site/top/jquery-turtle.js",
            "site/top/unerscore.js"
          ]
        },
        options: {
          preserveComments: false,
          report: "min",
          beautify: {
            ascii_only: true
          }
        }
      }
    },
    qunit: {
      all: ["test/*.html"]
    },
    release: {
      options: {
        bump: false
      }
    }
  });

  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-release');

  grunt.registerTask("default", ["uglify", "qunit"]);
};

