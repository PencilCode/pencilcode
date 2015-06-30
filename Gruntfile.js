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
          destPrefix: 'content'
        },
        files: {
          'lib/almond.js': 'almond/almond.js',
          'lib/coffee-script.js': 'coffee-script/extras/coffee-script.js',
          'lib/droplet.js': 'droplet/dist/droplet-full.js',
          'lib/droplet.css': 'droplet/dist/droplet.min.css',
          'lib/iced-coffee-script.js':
             'iced-coffee-script/extras/iced-coffee-script-1.8.0-c.js',
          'lib/jquery.js' : 'jquery/dist/jquery.js',
          'lib/jquery.autocomplete.js':
              'devbridge-autocomplete/dist/jquery.autocomplete.js',
          'lib/jquery.autocomplete.min.js':
              'devbridge-autocomplete/dist/jquery.autocomplete.min.js',
          'lib/jquery-deparam.js' : 'jquery-deparam/jquery-deparam.js',
          'lib/jquery-turtle.js': 'jquery-turtle/jquery-turtle.js',
          'lib/lodash.js': 'lodash/dist/lodash.js',
          'lib/pencil-tracer.js': 'pencil-tracer/pencil-tracer.js',
          'lib/require.js': 'requirejs/require.js',
          'lib/seedrandom.js': 'seedrandom/seedrandom.js',
          'lib/socket.io.js': 'socket.io-client/socket.io.js'
        }
      },
      zeroclipboard: {
        options: {
          destPrefix: 'content/lib/zeroclipboard'
        },
        files: {
          'ZeroClipboard.js' : 'zeroclipboard/dist/ZeroClipboard.js',
          'ZeroClipboard.swf' : 'zeroclipboard/dist/ZeroClipboard.swf'
        }
      },
      tooltipster: {
        options: {
          destPrefix: 'content/lib/tooltipster'
        },
        files: {
          'js': 'tooltipster/js',
          'css': 'tooltipster/css'
        }
      },
      lib: {
        options: {
          destPrefix: 'content/lib'
        },
        files: {
          'ace' : 'ace-builds/src-min-noconflict',
          'bootstrap' : 'bootstrap'
        }
      },
      sourcemap: {
        options: {
          destPrefix: 'content/lib/sourcemap'
        },
        files: {
          'array-set.js': 'source-map/lib/source-map/array-set.js',
          'base64.js': 'source-map/lib/source-map/base64.js',
          'base64-vlq.js': 'source-map/lib/source-map/base64-vlq.js',
          'binary-search.js': 'source-map/lib/source-map/binary-search.js',
          'source-map-consumer.js':
              'source-map/lib/source-map/source-map-consumer.js',
          'util.js': 'source-map/lib/source-map/util.js'
        }
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: 'content',
          deps: ['src/editor-main'],
          name: 'lib/almond',
          out: 'content/editor.js',
          useStrict: true,
          // optimize: 'none',
          mainConfigFile: 'content/src/editor-main.js',
          preserveLicenseComments: false
        }
      }
    },
    replace: {
      dist: {
        options: {
          patterns: [ {
            match:
              /<script data-main=".*\/([^\/"-]*)-main" src=".*require.js">/,
            replacement:
              "<script src=\"//<!--#echo var=\"site\"-->/$1.js\"></script>"
          } ]
        },
        files: [ {
          expand: true,
          flatten: true,
          src: [
            'content/src/editor.html',
            'content/src/framed.html'
          ],
          dest: 'content'
        } ]
      }
    },
    uglify: {
      all: {
        files: {
          'content/turtlebits.js': [
            'content/lib/iced-coffee-script.js',
            'content/lib/jquery.js',
            'content/lib/jquery-turtle.js',
            'content/lib/lodash.js',
            'content/lib/seedrandom.js',
            'content/lib/socket.io.js',
            'content/lib/recolor.js',
            'content/src/showturtle.js'
          ]
        },
        options: {
          preserveComments: false,
          report: 'min',
          compress: {
            unsafe: true,
            "screw_ie8": true,
            "pure_getters": true
          },
          beautify: {
            semicolons: false
          }
        }
      }
    },
    imagemin: {
      dynamic: {
        options: {
          optimizationLevel: 7
        },
        files: [{
          expand: true,
          cwd: 'content/',
          src: ['**/*.{png, jpg, gif}'],
          dest: 'content/'
        }]
      }
    },
    less: {
      all: {
        options: { compress: true },
        files: {
          "content/welcome.css": "content/src/welcome.less",
          "content/editor.css": "content/src/editor.less"
        }
      }
    },
    concat: {
      all: {
        src: [
          'content/lib/iced-coffee-script.js',
          'content/lib/jquery.js',
          'content/lib/jquery-turtle.js',
          'content/lib/lodash.js',
          'content/lib/seedrandom.js',
          'content/lib/socket.io.js',
          'content/lib/recolor.js',
          'content/src/showturtle.js'
        ],
        dest: 'content/turtlebits.js'
      },
      options: {
        separator: ';'
      }
    },
    express: {
      options: {
        port: grunt.option('port'),
        output: 'listening'
      },
      dev: {
        options: {
          script: 'server/devserver.js',
          node_env: 'development'
        }
      },
      sdev: {
        options: {
          script: 'server/devserver.js',
          node_env: 'sdevelopment'
        }
      },
      localtest: {
        options: {
          script: 'server/devserver.js',
          node_env: 'test'
        }
      },
      devtest: {
        options: {
          script: 'server/devserver.js',
          node_env: 'development',
          port: 8193
        }
      },
      test: {
        options: {
          script: 'server/devserver.js',
          node_env: 'test',
          port: 8193
        }
      }
    },
    sed: {
      iced: {
        pattern: '\n\\(function\\(root\\)',
        replacement: '\nthis.CoffeeScript||(function(root)',
        path: 'content/lib/iced-coffee-script.js',
        recursive: false
      }
    },
    watch: {
      sources: {
        files: [
          'server/*.js',
          'server/*.json',
          'content/src/filetype.js' ],
        options: { spawn: false }
      },
      styles: {
        files: ['content/src/*.less'],
        tasks: ['less'],
        options: { spawn: false }
      }
    },
    copy: {
      testdata: {
        files: [ {
          expand: true,
          cwd: 'test/data/',
          src: ['**'],
          dot: true,
          dest: 'local/data'
        } ]
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
    },
    'node-inspector': {
      dev: { }
    }
  });

  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-node-inspector');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-sed');

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

  grunt.task.registerTask('builddate', 'Create builddate.txt file', function() {
    var stamp = grunt.template.today('dddd, mmmm dS, yyyy, HH:MM:ss Z');
    grunt.file.write('content/builddate.txt', stamp);
    grunt.log.writeln('Build date: ' + stamp);
  });

  grunt.task.registerTask('test', 'Run integration tests.',
  function(testname) {
    if (!!testname) {
      grunt.config('mochaTest.test.src', ['test/' + testname + '.js']);
    }
    grunt.task.run('copy:testdata');
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

  // "update" does a bowercopy and a sed.
  grunt.registerTask('update', ['bowercopy', 'sed']);
  // "devserver" serves editor code directly from the src directory.
  grunt.registerTask('devserver',
      ['proxymessage', 'express:dev', 'watch']);
  // "devserver" serves editor code directly from the src directory.
  grunt.registerTask('sdevserver',
      ['proxymessage', 'express:sdev', 'watch']);
  // "devserver" serves editor code directly from the src directory.
  grunt.registerTask('testserver',
      ['proxymessage', 'express:localtest', 'watch']);
  // "debug" overwrites turtlebits.js with an unminified version.
  grunt.registerTask('debug', ['concat', 'devtest']);
  // "build", for development, builds code without running tests.
  grunt.registerTask('build',
      ['requirejs', 'replace', 'uglify', 'less', 'builddate']);
  // default target: compile editor code and uglify turtlebits.js, and test it.
  grunt.registerTask('default',
      ['build', 'test']);
};
