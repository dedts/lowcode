define('ace/snippets/handlebars', ['require', 'exports', 'module'], function(require, exports, module) {
  'use strict'

  exports.snippetText = ''
  exports.scope = 'handlebars'
});
(function() {
  window.require(['ace/snippets/handlebars'], function(m) {
    if (typeof module === 'object' && typeof exports === 'object' && module) {
      module.exports = m
    }
  })
})()
