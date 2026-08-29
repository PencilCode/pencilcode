var os=require('os');
var fs = require('fs');

// Determine if this is being built on Windows Subsystem for Linux; if so, we avoid direct device access.
var isWSL = false;

if (os.platform() === 'linux') {
  if (fs.readFileSync("/proc/version", 'utf8').indexOf("Microsoft") > -1) {
      isWSL = true;
  }
}

module.exports = function(grunt) {
  'use strict';

  var NO_PARSE = [ // It is kind of buggy, only accepts absolute paths.
    require.resolve('./content/lib/pencil-tracer.js'),
    require.resolve('./content/lib/droplet.js')
  ]

  grunt.option.init({
    port: 8008
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bowercopy: {
      options: {
        clean: false
      },
      top: {
        options: {
          destPrefix: 'content'
        },
        files: {
          'lib/almond.js': 'almond/almond.js',
          'lib/coffee-script.js': 'coffee-script/extras/coffee-script.js',
          'lib/droplet.js': 'droplet/dist/droplet-full.js',
          'lib/droplet.css': 'droplet/css/droplet.css',
          'lib/html2canvas.js': 'html2canvas/dist/html2canvas.js',
          'lib/iced-coffee-script-orig.js':
             'iced-coffee-script/extras/iced-coffee-script-1.8.0-c.js',
          'lib/jquery.js' : 'jquery/dist/jquery.js',
          'lib/jquery.autocomplete.min.js':
              'devbridge-autocomplete/dist/jquery.autocomplete.min.js',
          'lib/jquery-deparam.js' : 'jquery-deparam/jquery-deparam.js',
          'lib/jquery-turtle.js': 'jquery-turtle/jquery-turtle.js',
          'lib/js2coffee.js': 'js2coffee/dist/js2coffee.js',
          'lib/lodash.js': 'lodash/lodash.js',
          'lib/p5.js': 'p5/index.js',
          'lib/pencil-tracer.js': 'pencil-tracer/pencil-tracer.js',
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
          'js': 'tooltipster/dist/js',
          'css': 'tooltipster/dist/css'
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
      }
    },
    browserify: {
      dist: {
        files: {
          'content/editor.js': 'content/src/editor-main.js'
        },
        options: {
          browserifyOptions: {
            debug: false,
            noParse: NO_PARSE
          },
          watch: false,
          keepalive: false
        }
      },
      server: {
        files: {
          'content/editor.js': 'content/src/editor-main.js'
        },
        options: {
          browserifyOptions: {
            debug: true,
            noParse: NO_PARSE
          },
          watch: true,
          keepalive: true
        }
      }
    },
    uglify: {
      all: {
        files: {
          'content/turtlebits.js': [
            'content/lib/iced-coffee-script.js',
            'content/lib/jquery.js',
            'content/lib/jquery-turtle.js',
            'content/lib/js2coffee.js',
            'content/lib/lodash.js',
            'content/lib/seedrandom.js',
            'content/lib/socket.io.js',
            'content/lib/recolor.js',
            'content/src/showturtle.js'
          ],
          'content/editor.js': [
            'content/editor.js'
          ]
        },
        options: {
          preserveComments: false,
          screwIE8: true,
          report: 'min',
          beautify: {
            beautify: false
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
          "content/editor.css": "content/src/editor.less",
          "content/lib/font-awesome.css": "content/lib/font-awesome/font-awesome.less"
        }
      }
    },
    concat: {
      all: {
        src: [
          'content/lib/iced-coffee-script.js',
          'content/lib/jquery.js',
          'content/lib/jquery-turtle.js',
          'content/lib/js2coffee.js',
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
    'string-replace': {
      iced: {
        files: {
          'content/lib/iced-coffee-script.js':
                  'content/lib/iced-coffee-script-orig.js'
        },
        options: {
          replacements: [
            {
              pattern: '\n\\(function\\(root\\)',
              replacement: '\nthis.CoffeeScript||(function(root)'
            }
          ]
        }
      }
    },
    watch: {
      sources: {
        files: [
          'server/*.js',
          'server/**/*.json'
        ],
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
  });

  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  // Load slow imagemin tasks only when "imagemin" is explicitly specified.
  if (process.argv.indexOf('imagemin') >= 0) {
    grunt.loadNpmTasks('grunt-contrib-imagemin');
  }
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-string-replace');

  grunt.registerTask('proxymessage', 'Show proxy instructions', function() {
    var port = grunt.option('port');
    grunt.log.writeln(
      'Point your browser proxy autoconfig to one of these (or download\n' +
      'a local copy of one of these proxy.pacs).  Then the dev server\n' +
      'can be used at http://pencilcode.net.dev/');

    if (isWSL) {
      grunt.log.writeln('http://127.0.0.1:' + port + '/proxy.pac');
    }

    else {
      var ifaces = os.networkInterfaces();
      for (var dev in ifaces) {
        ifaces[dev].forEach(function(details) {
          if (details.family == 'IPv4') {
            grunt.log.writeln('http://' + details.address + ':' + port + '/proxy.pac');
          }
        });
      }
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
  grunt.registerTask('update', ['bowercopy', 'string-replace']);
  // "devserver" serves editor code directly from the src directory.
  grunt.registerTask('devserver',
      ['proxymessage', 'express:dev', 'browserify:server', 'watch']);
  // "devserver" serves editor code directly from the src directory.
  grunt.registerTask('sdevserver',
      ['proxymessage', 'express:sdev', 'browserify:server', 'watch']);
  // "devserver" serves editor code directly from the src directory.
  grunt.registerTask('testserver',
      ['proxymessage', 'express:localtest', 'watch']);
  // "debug" overwrites turtlebits.js with an unminified version.
  grunt.registerTask('debug', ['concat', 'devtest']);
  // "build", for development, builds code without running tests.
  grunt.registerTask('build',
      ['browserify:dist', 'uglify', 'less', 'builddate']);
  // default target: compile editor code and uglify turtlebits.js, and test it.
  grunt.registerTask('default',
      ['build', 'test']);
};

