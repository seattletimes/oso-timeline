module.exports = function(grunt) {

  grunt.registerTask("csv-json", function() {
    grunt.task.requires("state");
    grunt.task.requires("csv");

    //take each spreadsheet, and join them into an object with keys for each year
    var years = {};
    var csv = grunt.data.csv;

    csv.aerials.forEach(function(pic) {
      years[pic.year] = {
        aerial: pic.description,
        credit: pic.credit
      };
    });
    csv.homes.forEach(function(home) {
      var year = years[home.year];
      if (!year) {
        year = years[home.year] = {
          homes: []
        };
      }
      if (!year.homes) {
        year.homes = [];
      }
      year.homes.push(home);
    });
    csv.landslides.forEach(function(slide) {
      var date = String(slide.date).split("/");
      var year = date.pop();
      years[year] = years[year] || {};
      if (slide.forceAfter || (date && date[0] > 6)) {
        years[year].lateSlide = slide;
      } else {
        years[year].slide = slide;
      }
    });
    csv.timeline.forEach(function(row) {
      var year = row.date.split("/").pop();
      var dest = years[year] = years[year] || {};
      var category = row.type;
      if (!dest[category]) dest[category] = [];
      if (row.link) {
        if (row.link.indexOf(".jpg")) {
          row.image = row.link;
          delete row.link;
        }
      }
      dest[category].push(row);
    });
    //fill in missing years, may be disabled for very old red flags
    /*var all = Object.keys(years).sort();
    for (var i = 1930; i < all.pop() * 1; i++) {
      if (!years[i]) years[i] = {};
    }*/

    grunt.file.write("build/data.json", JSON.stringify(years, null, 2));

  });

}