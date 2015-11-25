module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';\n'
      },
      dist: {
        src: [
          'public/js/vendor/**/*.js',
          'public/js/oldMath.js',
          'public/js/classes/**/*.js',
          'public/js/main.js',
          'public/js/**/*.js'
        ],
        dest: 'public/js/dist/client.min.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'public/js/dist/client.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: [
        'Gruntfile.js',
        'public/js/**/*.js',
        'test/**/*.js',
        '!public/js/vendor/**/*.js',
        '!public/js/dist/**/*.js'
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
