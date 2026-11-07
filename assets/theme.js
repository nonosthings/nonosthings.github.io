(function () {
  var storageKey = "nn-theme";
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

  function getPreferredTheme() {
    try {
      var saved = localStorage.getItem(storageKey);
      if (saved === "light" || saved === "dark") {
        return saved;
      }
    } catch (e) {}
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", theme === "dark" ? "#0b1017" : "#f6f8fb");
    }
    var buttons = document.querySelectorAll("[data-theme-toggle]");
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      var nextMode = theme === "dark" ? "light" : "dark";
      btn.setAttribute("aria-label", "Switch to " + nextMode + " mode");
      btn.setAttribute("title", "Switch to " + nextMode + " mode");
      var label = btn.querySelector("[data-theme-label]");
      if (label) {
        label.textContent = theme === "dark" ? "Light" : "Dark";
      }
    }
  }

  applyTheme(getPreferredTheme());
  applySocialLinks();

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(root.getAttribute("data-theme") || getPreferredTheme());
    applySocialLinks();

    var buttons = document.querySelectorAll("[data-theme-toggle]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function () {
        var current = root.getAttribute("data-theme") || getPreferredTheme();
        var next = current === "dark" ? "light" : "dark";
        try {
          localStorage.setItem(storageKey, next);
        } catch (e) {}
        applyTheme(next);
      });
    }
  });

  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    if (mq.addEventListener) {
      mq.addEventListener("change", function (e) {
        try {
          if (!localStorage.getItem(storageKey)) {
            applyTheme(e.matches ? "dark" : "light");
          }
        } catch (err) {
          applyTheme(e.matches ? "dark" : "light");
        }
      });
    }
  }
})();
