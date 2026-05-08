import { useEffect, useRef } from 'react';

export default function CodeEditor({ value, onChange, onRun, disabled }) {
  const ref = useRef(null);

  useEffect(() => {
    const t = ref.current;
    if (!t) return;
    const handleKey = (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = t.selectionStart, end = t.selectionEnd;
        const next = value.slice(0, start) + '    ' + value.slice(end);
        onChange(next);
        requestAnimationFrame(() => { t.selectionStart = t.selectionEnd = start + 4; });
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        onRun?.();
      }
    };
    t.addEventListener('keydown', handleKey);
    return () => t.removeEventListener('keydown', handleKey);
  }, [value, onChange, onRun]);

  return (
    <textarea
      ref={ref}
      className="code"
      spellCheck="false"
      autoCapitalize="off"
      autoCorrect="off"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      placeholder="# Write Python here…"
    />
  );
}
