var os=require('os');

module.exports = function(grunt) {
  "use strict";

  grunt.option.init({
    port: 8008
  });

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
          "lodash.js": "lodash/dist/lodash.js",
          "seedrandom.js": "seedrandom/seedrandom.js"
        }
      },
      lib: {
        options: {
          destPrefix: "site/top/lib"
        },
        files: {
          "ace" : "ace-builds/src-min-noconflict"
        }
      },
      src: {
        options: {
          destPrefix: "site/top/src"
        },
        files: {
          "require.js": "requirejs/require.js",
          "almond.js": "almond/almond.js"
        }
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: "site/top",
          deps: ["src/editor-main"],
          name: 'src/almond',
          out: "site/top/editor.js",
          mainConfigFile: "site/top/src/editor-main.js",
          preserveLicenseComments: false
        }
      }
    },
    replace: {
      dist: {
        options: {
          patterns: [ {
           match: /<script data-main=".*\/([^\/"-]*)-main" src=".*require.js">/,
           replacement: "<script>document.write('<script src=\"//' + " +
                        "window.pencilcode.domain + '/$1.js\"></' + " +
                        "'script>');"
          } ]
        },
        files: [ {
          expand: true,
          flatten: true,
          src: [ "site/top/src/editor.html" ],
          dest: "site/top"
        } ]
      }
    },
    uglify: {
      all: {
        files: {
          "site/top/turtlebits.js": [
            "site/top/iced-coffee-script.js",
            "site/top/jquery.js",
            "site/top/jquery-turtle.js",
            "site/top/lodash.js"
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
    express: {
      options: {
        script: "dev/server.js",
        background: true,
        port: grunt.option('port')
      },
      dev: {
        node_env: 'development'
      },
      comp: {
        node_env: 'compiled'
      }
    },
    watch: {
      dev: {
        files: ["dev/server.js"],
        tasks: ['express:dev'],
        options: { atBegin: true, spawn: false }
      },
      comp: {
        files: ["dev/server.js"],
        tasks: ['express:comp'],
        options: { atBegin: true, spawn: false }
      }
    },
    qunit: {
      all: ["test/*.html"]
    }
  });

  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('proxymessage', 'Show proxy instructions', function() {
    var port = grunt.option('port');
    var ifaces = os.networkInterfaces();
    grunt.log.writeln(
      'Point your browser proxy autoconfig to one of these, and then use\n' +
      'the dev server by visiting http://pencilcode.net.dev/');
    for (var dev in ifaces) {
      ifaces[dev].forEach(function(details) {
        if (details.family == 'IPv4') {
          grunt.log.writeln(
            'http://' + details.address + ':' + port + '/proxy.pac');
        }
      });
    }
  });

  grunt.registerTask('devserver', ["proxymessage", "watch:dev"]);
  grunt.registerTask('compserver', ["proxymessage", "watch:comp"]);
  grunt.registerTask("default", ["requirejs", "uglify", "qunit"]);
};

