

module.exports = function(grunt) {

  //load tasks
  grunt.loadTasks("./tasks");

  grunt.registerTask("data", "Load and export all data objects", ["state", "json", "csv", "csv-json"]);
  grunt.registerTask("template", "Perform a complete build of data and templates", ["data", "build"]);
  grunt.registerTask("default", ["static", "connect:dev", "watch"]);
  grunt.registerTask("static", ["copy", "amd", "less", "template"]);
}
