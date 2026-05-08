// Pyodide Web Worker — runs Python in isolation off the main thread
// Compatible with vite-plugin-pwa precaching (CDN cached via runtimeCaching).
let pyodideReady = null;

async function init() {
  if (pyodideReady) return pyodideReady;
  importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js');
  pyodideReady = (async () => {
    const py = await loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/' });
    // Sandbox: block dangerous modules at import time
    py.runPython(`
import builtins, sys
_blocked = {'os', 'sys', 'subprocess', 'socket', 'shutil', 'pathlib', 'requests', 'urllib'}
_orig_import = builtins.__import__
def _safe_import(name, *a, **k):
    root = name.split('.')[0]
    if root in _blocked:
        raise ImportError(f"Module '{root}' is blocked in this sandbox")
    return _orig_import(name, *a, **k)
builtins.__import__ = _safe_import
for forbidden in ('eval', 'exec', 'open', 'compile'):
    if hasattr(builtins, forbidden):
        try: setattr(builtins, forbidden, lambda *a, **k: (_ for _ in ()).throw(NameError(f"{forbidden} disabled")))
        except: pass
`);
    return py;
  })();
  return pyodideReady;
}

self.onmessage = async (e) => {
  const { id, code } = e.data || {};
  try {
    const py = await init();
    // Capture stdout
    py.runPython('import sys, io; sys.stdout = io.StringIO(); sys.stderr = io.StringIO()');
    let result = '';
    let pyExc = null;
    try {
      result = await py.runPythonAsync(code);
    } catch (err) { pyExc = String(err); }
    const stdout = py.runPython('sys.stdout.getvalue()') || '';
    const stderr = py.runPython('sys.stderr.getvalue()') || '';
    // Capture top-level variable namespace as { name: reprValue } for verification
    const ns = py.runPython(`
import json
_locals = {k: v for k, v in globals().items() if not k.startswith('_') and k not in ('sys','io','json')}
def _safe(v):
    try:
        json.dumps(v); return v
    except Exception:
        return repr(v)
json.dumps({k: _safe(v) for k, v in _locals.items()})
`);
    self.postMessage({
      id,
      ok: !pyExc,
      stdout: String(stdout),
      stderr: String(stderr),
      result: pyExc ? null : (result === undefined ? null : String(result)),
      error: pyExc,
      namespace: ns ? JSON.parse(ns) : {}
    });
  } catch (err) {
    self.postMessage({ id, ok: false, error: String(err), stdout: '', stderr: '', namespace: {} });
  }
};
