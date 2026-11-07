(function () {
  var storageKey = "nn-theme-preference";
  var root = document.documentElement;
  var fbHost = ["face", "book", ".com"].join("");
  var fbPath = ["noahs", "things"].join("");
  var fbHref = "https://" + fbHost + "/" + fbPath;

  function applySocialLinks() {
    var links = document.querySelectorAll("[data-fb-link]");
    for (var i = 0; i < links.length; i++) {
      links[i].setAttribute("href", fbHref);
    }
  }

  function getSystemTheme() {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }

  function getStoredPreference() {
    try {
      var saved = localStorage.getItem(storageKey);
      if (saved === "light" || saved === "dark" || saved === "system") {
        return saved;
      }
    } catch (e) {}
    return "system";
  }

  function resolveEffectiveTheme(pref) {
    if (pref === "system") {
      return getSystemTheme();
    }
    return pref;
  }

  function updateControls(pref, effective) {
    var segments = document.querySelectorAll(".theme-segment");
    for (var i = 0; i < segments.length; i++) {
      var seg = segments[i];
      var isSelected = seg.getAttribute("data-theme-value") === pref;
      seg.setAttribute("aria-checked", isSelected ? "true" : "false");
    }
  }

  function applyTheme(pref) {
    var effective = resolveEffectiveTheme(pref);
    root.setAttribute("data-theme", effective);
    root.setAttribute("data-theme-preference", pref);

    var metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", effective === "dark" ? "#0b1017" : "#f6f8fb");
    }

    updateControls(pref, effective);
  }

  var initialPref = getStoredPreference();
  applyTheme(initialPref);
  applySocialLinks();

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(getStoredPreference());
    applySocialLinks();

    var segments = document.querySelectorAll(".theme-segment");
    for (var i = 0; i < segments.length; i++) {
      segments[i].addEventListener("click", function () {
        var value = this.getAttribute("data-theme-value");
        if (value === "system" || value === "light" || value === "dark") {
          try {
            localStorage.setItem(storageKey, value);
          } catch (e) {}
          applyTheme(value);
        }
      });
    }
  });

  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var handler = function () {
      if (getStoredPreference() === "system") {
        applyTheme("system");
      }
    };
    if (mq.addEventListener) {
      mq.addEventListener("change", handler);
    } else if (mq.addListener) {
      mq.addListener(handler);
    }
  }
})();
