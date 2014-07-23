var shell = require("shelljs");

module.exports = function(grunt) {

  grunt.registerTask("copy", function() {

    //copy all asset files over
    shell.cp("-r", "src/assets", "build");

  });

}