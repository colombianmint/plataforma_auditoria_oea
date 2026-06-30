/* base.js — Prefijo de ruta para GitHub Pages (subdirectorio del repo) */
(function (global) {
  "use strict";
  var REPO = "plataforma_auditoria_oea";
  var path = global.location.pathname;
  var base = "";
  var marker = "/" + REPO + "/";
  var idx = path.indexOf(marker);
  if (idx >= 0) {
    base = path.slice(0, idx + marker.length);
  } else if (path.endsWith("/" + REPO)) {
    base = path + "/";
  }
  global.__APP_BASE__ = base;
  global.asset = function (rel) {
    rel = String(rel || "").replace(/^\//, "");
    return base + rel;
  };
})(window);
