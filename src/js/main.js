require([
  "util",
  "popup",
  "text!_timelineRactive.html",
  "share.min.js",
  "lib/ractive/ractive.js",
  "lib/jquery/dist/jquery.min.js"
], function(util, popup, timelineTemplate, Share) {

  //feature detection
  var isMobile = window.matchMedia && window.matchMedia("(max-device-width: 480px)").matches;

  var figure = $("#app figure");
  var timelineContainer = $("#app .timeline");
  var caption = figure.find("figcaption .caption");
  var originalText = caption.html();
  var credit = figure.find("figcaption .credit");
  var photoYear = figure.find(".photo-year");

  //set the timeline height so it's not too long
  if (isMobile) timelineContainer.height(window.innerHeight * .5 + 50);

  var landscapes = {};
  figure.find(".landscape").each(function(i, image) {
    landscapes[this.getAttribute("data-year")] = $(image);
  });

  var timeline = new Ractive({
    el: $("#app .timeline-list"),
    template: timelineTemplate,
    data: {
      events: {}
    }
  });

  var xhr = $.ajax({ url: "data.json", dataType: "json" });
  xhr.done(function(data) {
    timeline.set("events", data);
    var first = timeline.find(".dot");
    //show the first popup, constructing a fake event to do so.
    timeline.fire("dig", {
      context: data[1887].neighborhood[0],
      original: {},
      node: first
    });
  });

  //update images on scroll
  timelineContainer.on("scroll", util.debounce(function() {
    var children = timeline.el.querySelectorAll("[has-aerial]");
    var tBounds = this.getBoundingClientRect();
    var triggerPoint = isMobile ? tBounds.height / 2 : 260;
    var topmost = null;
    var active = null;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      var year = child.getAttribute("data-year");
      var bounds = child.getBoundingClientRect();
      if (bounds.top < tBounds.top + triggerPoint) {
        landscapes[year].addClass("show");
        topmost = year;
        active = child;
      } else {
        landscapes[year].removeClass("show");
      }
    }
    photoYear.toggle(!!topmost);
    figure.toggleClass("pointed", !!topmost);
    photoYear.html(topmost);
    timelineContainer.find(".active-year").removeClass("active-year");
    if (active) active.className += " active-year";
    var data = timeline.data.events[topmost];
    caption.html(data ? data.aerial : originalText);
    credit.html(data ? "Photo: " + data.credit : "");
  }, 100));

  var lazyHide = null;

  timeline.on({
    dig: function(e) {
      if (e.original.type == "mouseover" && isMobile) return;
      if (lazyHide) {
        clearTimeout(lazyHide);
        lazyHide = null;
      }
      var template = e.context.type;
      if (e.context.parcel) {
        template = "housing"
      }
      popup.show(template, e.context, e.node);
    },
    close: function(e) {
      if (e.original.type == "mouseout" && isMobile) return;
      if (lazyHide) return;
      lazyHide = setTimeout(function() {
        lazyHide = null;
        popup.hide();
      }, 200);
    }
  });

  //toggle figure display on mobile
  $(".drawer-pull").on("click", function(e) {
    figure.find("figcaption").toggleClass("show-details");
  });

  //collapse sources and credits
  var collapse = $(".collapsible");
  collapse.find(".content").hide();
  collapse.on("click", ".trigger", function() {
    var parent = $(this).closest(".collapsible");
    parent.find(".content").slideToggle();
    parent.toggleClass("expanded");
  });

  //create read more link at top of the page
  $(".read-more").each(function(i, item) {
    var $item = $(item);
    var link = $("<a class='more-link'>Read more...</a>");
    $item.replaceWith(link);
    link.on("click", function() {
      link.replaceWith($item);
      $item.hide().fadeIn();
    });
  });

  //add the share link
  new Share(".sharing", {
    ui: {
      flyout: "bottom left"
    }
  });

});