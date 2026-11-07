(function () {
  var root = document.documentElement;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Content stays visible unless this script runs and the browser can observe scrolling.
  if (reduced || !("IntersectionObserver" in window)) {
    return;
  }

  root.classList.add("js");

  document.addEventListener("DOMContentLoaded", function () {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) {
      root.classList.remove("js");
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            entries[i].target.classList.add("is-in");
            observer.unobserve(entries[i].target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    for (var j = 0; j < items.length; j++) {
      observer.observe(items[j]);
    }
  });
})();
