import { useEffect, useRef, useState, useCallback } from 'react';

export function usePyodide() {
  const workerRef = useRef(null);
  const counterRef = useRef(0);
  const pendingRef = useRef(new Map());
  const [ready, setReady] = useState(false);
  const [warming, setWarming] = useState(false);

  useEffect(() => {
    const w = new Worker(new URL('../workers/pyodide.worker.js', import.meta.url), { type: 'module' });
    workerRef.current = w;
    w.onmessage = (e) => {
      const { id } = e.data;
      const resolve = pendingRef.current.get(id);
      if (resolve) { resolve(e.data); pendingRef.current.delete(id); }
    };
    // Warm up
    setWarming(true);
    runPython('1+1', 30000).then(() => { setReady(true); setWarming(false); }).catch(() => setWarming(false));
    return () => { w.terminate(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runPython = useCallback((code, timeoutMs = 5000) => {
    return new Promise((resolve, reject) => {
      const id = ++counterRef.current;
      const timer = setTimeout(() => {
        pendingRef.current.delete(id);
        // Hard-kill: rebuild worker to escape infinite loops
        try { workerRef.current?.terminate(); } catch {}
        const w = new Worker(new URL('../workers/pyodide.worker.js', import.meta.url), { type: 'module' });
        workerRef.current = w;
        w.onmessage = (e) => {
          const { id } = e.data;
          const r = pendingRef.current.get(id);
          if (r) { r(e.data); pendingRef.current.delete(id); }
        };
        reject(new Error(`Execution exceeded ${timeoutMs}ms — possible infinite loop`));
      }, timeoutMs);
      pendingRef.current.set(id, (data) => { clearTimeout(timer); resolve(data); });
      workerRef.current.postMessage({ id, code });
    });
  }, []);

  return { ready, warming, runPython };
}
