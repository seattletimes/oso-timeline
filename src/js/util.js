define([], function() {
  return {
    debounce: function(f, wait) {
      var timeout = null;
      return function() {
        if (timeout) return;
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        timeout = setTimeout(function() {
          timeout = null;
          f.apply(self, args);
        }, wait || 30);
      }
    }
  };
});