define('ace/snippets/sparql', ['require', 'exports', 'module'], function(require, exports, module) {
  'use strict'

  exports.snippetText = undefined
  exports.scope = ''
});
(function() {
  window.require(['ace/snippets/sparql'], function(m) {
    if (typeof module === 'object' && typeof exports === 'object' && module) {
      module.exports = m
    }
  })
})()
