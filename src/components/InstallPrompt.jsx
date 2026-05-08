import { useEffect, useState } from 'react';

const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

export default function InstallPrompt({ accent = '#4ecdc4', appName = 'this app' }) {
  const [deferred, setDeferred] = useState(null);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem('pwa-prompt-dismissed') === '1');

  useEffect(() => {
    if (isStandalone()) { setInstalled(true); return; }

    const onBeforeInstall = (e) => { e.preventDefault(); setDeferred(e); };
    const onInstalled = () => { setInstalled(true); setDeferred(null); };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);

    if (isIOS() && !isStandalone() && !dismissed) {
      const t = setTimeout(() => setShowIOSHint(true), 2500);
      return () => clearTimeout(t);
    }
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, [dismissed]);

  const onInstall = async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  const dismiss = () => { localStorage.setItem('pwa-prompt-dismissed', '1'); setDismissed(true); setShowIOSHint(false); setDeferred(null); };

  if (installed || dismissed) return null;

  if (deferred) {
    return (
      <div style={pillStyle(accent)} role="dialog" aria-label="Install app">
        <span style={{ flex: 1 }}>📱 Install {appName} to your Home Screen</span>
        <button onClick={onInstall} style={btn(accent)}>Install</button>
        <button onClick={dismiss} style={dismissBtn}>×</button>
      </div>
    );
  }

  if (showIOSHint) {
    return (
      <div style={pillStyle(accent)} role="dialog" aria-label="Add to Home Screen on iOS">
        <span style={{ flex: 1, fontSize: 13, lineHeight: 1.35 }}>
          📱 Add to Home Screen: tap <b>Share</b>
          <span style={{ display: 'inline-block', margin: '0 4px', padding: '0 6px', border: `1px solid ${accent}`, borderRadius: 4 }}>⬆︎</span>
          → <b>Add to Home Screen</b>
        </span>
        <button onClick={dismiss} style={dismissBtn}>×</button>
      </div>
    );
  }

  return null;
}

const pillStyle = (accent) => ({
  position: 'fixed', bottom: 16, left: 16, right: 16, zIndex: 9999,
  padding: '12px 14px', background: 'rgba(15, 18, 30, 0.95)',
  border: `1px solid ${accent}`, borderRadius: 12, color: '#fff',
  display: 'flex', alignItems: 'center', gap: 8,
  backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.45)', maxWidth: 520, margin: '0 auto'
});
const btn = (accent) => ({
  padding: '8px 14px', background: accent, color: '#0a0a14',
  border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer'
});
const dismissBtn = {
  padding: '4px 8px', background: 'transparent', color: '#fff',
  border: 'none', fontSize: 20, cursor: 'pointer', opacity: 0.7
};
