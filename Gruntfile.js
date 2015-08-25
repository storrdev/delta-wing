module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';\n'
      },
      dist: {
        src: [
          //'src/client/lib/**/*.js',
          'src/client/lib/hand.min.1.3.8.js',
          'src/client/lib/cannon.js',
          'src/client/lib/Oimo.js',
          'src/client/lib/babylon.2.1.js',
          'src/client/oldMath.js',
          //'src/client/classes/**/*.js',
          //'src/client/main.js',
          'src/client/babylon_test.js',
          //'src/client/**/*.js'
        ],
        dest: 'dist/client.min.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/client.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: [
        'Gruntfile.js',
        'src/**/*.js',
        'test/**/*.js',
        '!src/client/lib/**/*.js'
      ],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'concat']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('test', ['jshint', 'concat']);

  grunt.registerTask('default', ['jshint', 'concat', 'watch']);

};
