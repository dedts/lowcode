define('ace/snippets/lisp', ['require', 'exports', 'module'], function(require, exports, module) {
  'use strict'

  exports.snippetText = ''
  exports.scope = 'lisp'
});
(function() {
  window.require(['ace/snippets/lisp'], function(m) {
    if (typeof module === 'object' && typeof exports === 'object' && module) {
      module.exports = m
    }
  })
})()
