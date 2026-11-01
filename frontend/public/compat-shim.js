// compat-shim.js — loaded FIRST in <head> (blocking), before any app or
// third-party script runs. Neutralizes deprecated APIs that Chrome now blocks
// under Permissions-Policy (unload) so external widgets (chat bubbles,
// embeds, platform scripts injected by the host page) can never trip them
// inside this document.
//
// What it does:
//   1. Redirects addEventListener('unload'/'beforeunload') → 'pagehide'
//      (the modern replacement), with a wrapper registry so
//      removeEventListener keeps working for the original listener.
//   2. Turns window.onunload / document.body.onunload property writes into
//      no-ops.
//   3. Adds a Permissions-Policy meta (unload=()) unless one already exists.
//
// Idempotent and dependency-free; safe to keep forever.
(function () {
  'use strict'
  if (window.__compatShimInstalled) return
  window.__compatShimInstalled = true

  // ── 1 + 2. Event-registration shims ──
  try {
    var origAdd = EventTarget.prototype.addEventListener
    var origRemove = EventTarget.prototype.removeEventListener
    var REPLACEMENTS = { unload: 'pagehide', beforeunload: 'pagehide' }
    var SHIM_FLAG = '__isUnloadShim'

    var patchedAdd = function (type, listener, options) {
      var replacement = REPLACEMENTS[type]
      if (!replacement || typeof listener !== 'function') {
        return origAdd.call(this, type, listener, options)
      }
      // Fire only when the document is actually going away (not on bfcache
      // restore, where pagehide also fires with persisted === true).
      var wrapped = function (ev) {
        if (ev && ev.persisted) return
        try { listener.call(this, ev) } catch (e) { /* never break the host */ }
      }
      wrapped[SHIM_FLAG] = true
      wrapped.__orig = listener
      // Registry: original listener -> all wrappers created for it.
      if (!this.__unloadShims) {
        try { this.__unloadShims = new Map() } catch (e) { this.__unloadShims = null }
      }
      if (this.__unloadShims) {
        var list = this.__unloadShims.get(listener)
        if (!list) { list = []; this.__unloadShims.set(listener, list) }
        list.push(wrapped)
      }
      return origAdd.call(this, replacement, wrapped, options)
    }

    var patchedRemove = function (type, listener, options) {
      var replacement = REPLACEMENTS[type]
      if (!replacement) return origRemove.call(this, type, listener, options)
      var store = this && this.__unloadShims
      if (store && store.has(listener)) {
        var wrappers = store.get(listener)
        for (var i = 0; i < wrappers.length; i++) {
          origRemove.call(this, replacement, wrappers[i], options)
        }
        store.delete(listener)
        return
      }
      // Maybe someone passes the wrapper itself, or nothing was registered.
      return origRemove.call(this, replacement, listener, options)
    }

    EventTarget.prototype.addEventListener = patchedAdd
    EventTarget.prototype.removeEventListener = patchedRemove

    // Property form: window.onunload = fn / window.onbeforeunload = fn → no-op.
    ;['unload', 'beforeunload'].forEach(function (evt) {
      var propName = 'on' + evt
      try {
        Object.defineProperty(window, propName, {
          configurable: true,
          get: function () { return null },
          set: function () { /* dropped — pagehide shim covers the use case */ },
        })
      } catch (e) { /* non-configurable on some engines — ignore */ }
    })
  } catch (e) { /* very old engine — leave everything as-is */ }

  // ── 3. Declare the policy for this document (and any same-origin frames that
  //      inherit it) unless the HTML already declares it. ──
  function ensureMeta() {
    try {
      var existing = document.querySelector('meta[http-equiv="Permissions-Policy"]')
      if (existing) return
      var meta = document.createElement('meta')
      meta.setAttribute('http-equiv', 'Permissions-Policy')
      meta.setAttribute('content', 'unload=()')
      if (document.head) document.head.insertBefore(meta, document.head.firstChild)
    } catch (e) { /* ignore */ }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureMeta)
  } else {
    ensureMeta()
  }
})()
