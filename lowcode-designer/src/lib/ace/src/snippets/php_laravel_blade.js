define('ace/snippets/php_laravel_blade', ['require', 'exports', 'module'], function(require, exports, module) {
  'use strict'

  exports.snippetText = ''
  exports.scope = 'php'
});
(function() {
  window.require(['ace/snippets/php_laravel_blade'], function(m) {
    if (typeof module === 'object' && typeof exports === 'object' && module) {
      module.exports = m
    }
  })
})()
