define('ace/snippets/nix', ['require', 'exports', 'module'], function(require, exports, module) {
  'use strict'

  exports.snippetText = ''
  exports.scope = 'nix'
});
(function() {
  window.require(['ace/snippets/nix'], function(m) {
    if (typeof module === 'object' && typeof exports === 'object' && module) {
      module.exports = m
    }
  })
})()
