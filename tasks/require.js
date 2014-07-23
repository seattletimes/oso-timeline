/*

Builds a source package, starting from src/js/main.js

*/

var r = require("requirejs");
var shell = require("shelljs");

module.exports = function(grunt) {

  grunt.registerTask("amd", "Compile AMD modules to build/main.js", function() {
    var c = this.async();

    //build an optimized app bundle
    //include almond for resource loading
    r.optimize({
      baseUrl: "src/js",
      name: "main",
      include: ["almond.js"],
      out: "build/app.js",
      generateSourceMaps: true,
      preserveLicenseComments: false,
      optimize: "none"
    }, c);
  })

};