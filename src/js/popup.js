define([
  "lib/icanhaz/ICanHaz.min.js",
  "lib/jquery/dist/jquery.min.js"
], function() {

  var timeline = $(".timeline");
  var popup = timeline.find(".popup");
  var tip = popup.find(".tip");
  var contents = popup.find(".contents");
  var hideTimer = null;

  var isMobile = window.matchMedia && window.matchMedia("(max-device-width: 768px)").matches;

  popup.on("click", ".close", function() {
    popup.hide();
  });

  popup.on("click", function(e) {
    e.stopPropagation();
  });

  timeline.on("click", ".channel, li", function(e) {
    var target = $(e.target);
    if (target.is(".channel, li")) {
      facade.hide();
    }
  });

  timeline.on("mouseout", ".dot", function() {
    if (isMobile) return;
    facade.hide();
  });

  $(document.body).on("keyup", function(e) {
    if (e.keyCode == "27") {
      popup.hide();
      e.preventDefault();
    }
  });

  var facade = {
    show: function(template, data, node) {
      var output;
      if (!ich[template]) {
        output = data.chatter;
      } else {
        output = ich[template](data);
      }
      popup.css({
        top: node.offsetTop + node.offsetHeight + 4
      });
      tip.css({
        left: node.offsetLeft - 6
      });
      contents.html(output);
      popup.show();
      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
    },
    hide: function() {
      if (hideTimer) return;
      hideTimer = setTimeout(function() {
        popup.hide();
        hideTimer = null;
      }, 10);
    }
  };

  return facade;

});