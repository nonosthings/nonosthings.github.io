(function () {
  var storageKey = "nn-theme-preference";
  var root = document.documentElement;
  var fbHost = ["face", "book", ".com"].join("");
  var fbPath = ["noahs", "things"].join("");
  var fbHref = "https://" + fbHost + "/" + fbPath;
  var fadeTimer = null;

  function isPreference(value) {
    return value === "system" || value === "light" || value === "dark";
  }

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
      if (isPreference(saved)) {
        return saved;
      }
    } catch (e) {}
    return "system";
  }

  function storePreference(value) {
    try {
      localStorage.setItem(storageKey, value);
    } catch (e) {}
  }

  function updateControls(pref) {
    var segments = document.querySelectorAll("[data-theme-value]");
    for (var i = 0; i < segments.length; i++) {
      var seg = segments[i];
      var selected = seg.getAttribute("data-theme-value") === pref;
      seg.setAttribute("aria-checked", selected ? "true" : "false");
      seg.setAttribute("tabindex", selected ? "0" : "-1");
    }
  }

  function applyTheme(pref) {
    var effective = pref === "system" ? getSystemTheme() : pref;
    root.setAttribute("data-theme", effective);
    root.setAttribute("data-theme-preference", pref);

    var metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", effective === "dark" ? "#0b1017" : "#f6f8fb");
    }

    updateControls(pref);
  }

  // Colour crossfade only when the visitor changes the theme, never on page load.
  function chooseTheme(pref) {
    if (!isPreference(pref)) {
      return;
    }
    root.classList.add("theme-fading");
    clearTimeout(fadeTimer);
    fadeTimer = setTimeout(function () {
      root.classList.remove("theme-fading");
    }, 320);
    storePreference(pref);
    applyTheme(pref);
  }

  applyTheme(getStoredPreference());
  applySocialLinks();

  // Delegated, so the buttons work whenever they are parsed and whatever the markup around them.
  document.addEventListener("click", function (event) {
    var target = event.target;
    var button = target && target.closest ? target.closest("[data-theme-value]") : null;
    if (button) {
      chooseTheme(button.getAttribute("data-theme-value"));
    }
  });

  // Radio-group keyboard behaviour: arrows move and select, Home and End jump.
  document.addEventListener("keydown", function (event) {
    var target = event.target;
    var current = target && target.closest ? target.closest("[data-theme-value]") : null;
    if (!current) {
      return;
    }
    var group = Array.prototype.slice.call(current.parentNode.querySelectorAll("[data-theme-value]"));
    var index = group.indexOf(current);
    var next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (index + 1) % group.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (index - 1 + group.length) % group.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = group.length - 1;
    }
    if (next > -1) {
      event.preventDefault();
      group[next].focus();
      chooseTheme(group[next].getAttribute("data-theme-value"));
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(getStoredPreference());
    applySocialLinks();
  });

  // Restored from the back/forward cache, or changed in another tab.
  window.addEventListener("pageshow", function () {
    applyTheme(getStoredPreference());
  });
  window.addEventListener("storage", function (event) {
    if (event.key === storageKey) {
      applyTheme(getStoredPreference());
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
