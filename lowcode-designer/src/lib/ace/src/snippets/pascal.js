define('ace/snippets/pascal', ['require', 'exports', 'module'], function(require, exports, module) {
  'use strict'

  exports.snippetText = ''
  exports.scope = 'pascal'
});
(function() {
  window.require(['ace/snippets/pascal'], function(m) {
    if (typeof module === 'object' && typeof exports === 'object' && module) {
      module.exports = m
    }
  })
})()
