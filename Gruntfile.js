'use strict';
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    version: "1.2",
    buildBase: 'dist',
    clean: ['<%= buildBase %>'],
    browserify: {
      dist: {
        files: {
          'dist/js/html2phaser.js': ['src/h2p/index.js'],
        },
        options: {
          transform: [["babelify", {presets: ["es2015"]}]],
          browserifyOptions: {
              standalone: 'html2phaser'
          }
        },
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n /**********************************************\n * Handcrafted by <%= pkg.author %>\n **********************************************/\n'
      },
      build: {
        expand: true,
        cwd: '<%= buildBase %>',
        src: ['js/*.js'],
        dest: '<%= buildBase %>',
        ext: '.min.js'
      }
    },
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('dist', [
    'clean',
    'browserify',
    'uglify',
  ]);
};
