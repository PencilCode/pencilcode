var os=require('os');

module.exports = function(grunt) {
  'use strict';

  grunt.option.init({
    port: 8008
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bowercopy: {
      options: {
        clean: true
      },
      top: {
        options: {
          destPrefix: 'site/top'
        },
        files: {
          'jquery.js' : 'jquery/dist/jquery.js',
          'iced-coffee-script.js': 'iced-coffee-script/extras/coffee-script.js',
          'jquery-turtle.js': 'jquery-turtle/jquery-turtle.js',
          'lodash.js': 'lodash/dist/lodash.js',
          'seedrandom.js': 'seedrandom/seedrandom.js'
        }
      },
      zeroclipboard: {
        options: {
          destPrefix: 'site/top/lib/zeroclipboard'
        },
        files: {
          'ZeroClipboard.js' : 'zeroclipboard/ZeroClipboard.js',
          'ZeroClipboard.swf' : 'zeroclipboard/ZeroClipboard.swf'
        }
      },
      tooltipster: {
        options: {
          destPrefix: 'site/top/lib/tooltipster'
        },
        files: {
          'js': 'tooltipster/js',
          'css': 'tooltipster/css'
        }
      },
      lib: {
        options: {
          destPrefix: 'site/top/lib'
        },
        files: {
          'ace' : 'ace-builds/src-min-noconflict'
        }
      },
      src: {
        options: {
          destPrefix: 'site/top/src'
        },
        files: {
          'require.js': 'requirejs/require.js',
          'almond.js': 'almond/almond.js'
        }
      },
      sourcemap: {
        options: {
          destPrefix: 'site/top/src/sourcemap'
        },
        files: {
          'array-set.js': 'source-map/lib/source-map/array-set.js',
          'base64.js': 'source-map/lib/source-map/base64.js',
          'base64-vlq.js': 'source-map/lib/source-map/base64-vlq.js',
          'binary-search.js': 'source-map/lib/source-map/binary-search.js',
          'source-map-consumer.js': 'source-map/lib/source-map/source-map-consumer.js',
          'util.js': 'source-map/lib/source-map/util.js'
        }
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: 'site/top',
          deps: ['src/editor-main'],
          name: 'src/almond',
          out: 'site/top/editor.js',
          mainConfigFile: 'site/top/src/editor-main.js',
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
          src: [
            'site/top/src/editor.html',
            'site/top/src/framed.html'
          ],
          dest: 'site/top'
        } ]
      }
    },
    uglify: {
      all: {
        files: {
          'site/top/turtlebits.js': [
            'site/top/iced-coffee-script.js',
            'site/top/jquery.js',
            'site/top/jquery-turtle.js',
            'site/top/lodash.js'
          ]
        },
        options: {
          preserveComments: false,
          report: 'min',
          beautify: {
            ascii_only: true
          }
        }
      }
    },
    concat: {
      all: {
        src: [
          'site/top/iced-coffee-script.js',
          'site/top/jquery.js',
          'site/top/jquery-turtle.js',
          'site/top/lodash.js'
        ],
        dest: 'site/top/turtlebits.js'
      },
      options: {
        separator: ';'
      }
    },
    express: {
      options: {
        script: 'dev/server.js',
        port: grunt.option('port'),
        output: 'listening'
      },
      dev: {
        options: {
          node_env: 'development'
        }
      },
      comp: {
        options: {
          node_env: 'compiled'
        }
      },
      devtest: {
        options: {
          node_env: 'development',
          port: 8193
        }
      },
      test: {
        options: {
          node_env: 'compiled',
          port: 8193
        }
      }
    },
    watch: {
      dev: {
        files: ['dev/server.js'],
        tasks: ['express:dev'],
        options: { atBegin: true, spawn: false }
      },
      comp: {
        files: ['dev/server.js'],
        tasks: ['express:comp'],
        options: { atBegin: true, spawn: false }
      }
    },
    mochaTest: {
      test: {
        src: ['test/*.js'],
        options: {
          timeout: 100000,
          reporter: 'list',
          colors: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('proxymessage', 'Show proxy instructions', function() {
    var port = grunt.option('port');
    var ifaces = os.networkInterfaces();
    grunt.log.writeln(
      'Point your browser proxy autoconfig to one of these (or download\n' +
      'a local copy of one of these proxy.pacs).  Then the dev server\n' +
      'can be used at http://pencilcode.net.dev/');
    for (var dev in ifaces) {
      ifaces[dev].forEach(function(details) {
        if (details.family == 'IPv4') {
          grunt.log.writeln(
            'http://' + details.address + ':' + port + '/proxy.pac');
        }
      });
    }
  });

  grunt.task.registerTask('test', 'Run integration tests.',
  function(testname) {
    if (!!testname) {
      grunt.config('mochaTest.test.src', ['test/' + testname + '.js']);
    }
    grunt.task.run('express:test');
    grunt.task.run('mochaTest');
  });

  grunt.task.registerTask('devtest', 'Run tests using uncompiled code.',
  function(testname) {
    if (!!testname) {
      grunt.config('mochaTest.test.src', ['test/' + testname + '.js']);
    }
    grunt.task.run('express:devtest');
    grunt.task.run('mochaTest');
  });

  // "devserver" serves editor code directly from the src directory.
  grunt.registerTask('devserver', ['proxymessage', 'watch:dev']);
  // "compserver" serves the compiled editor code, not the source.
  grunt.registerTask('compserver', ['proxymessage', 'watch:comp']);
  // "debug" overwrites turtlebits.js with an unminified version.
  grunt.registerTask('debug', ['concat', 'devtest']);
  // default target: compile editor code and uglify turtlebits.js, and test it.
  grunt.registerTask('default', ['requirejs', 'replace', 'uglify', 'test']);
};

