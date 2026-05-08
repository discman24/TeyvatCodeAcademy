import { useEffect, useState } from 'react';
import CodeEditor from './CodeEditor';
import { usePyodide } from '../hooks/usePyodide';
import { verifyMission } from '../utils/verify';
import { explainError, celebrate } from '../utils/gemini';
import { REGIONS } from '../data/regions';

export default function MissionRunner({ mission, onComplete, onBack, onHintUsed }) {
  const region = REGIONS.find(r => r.id === mission.region);
  const { ready, warming, runPython } = usePyodide();
  const [code, setCode] = useState(mission.starterCode);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [verdict, setVerdict] = useState(null); // null | 'pass' | 'fail'
  const [failures, setFailures] = useState([]);
  const [hintIndex, setHintIndex] = useState(-1);
  const [errorsHit, setErrorsHit] = useState(0);
  const [startedAt] = useState(Date.now());
  const [companionMsg, setCompanionMsg] = useState(`${region?.icon || '✨'} ${mission.brief}`);

  useEffect(() => {
    setCode(mission.starterCode);
    setVerdict(null);
    setOutput('');
    setFailures([]);
    setHintIndex(-1);
    setErrorsHit(0);
  }, [mission.id]);

  const run = async () => {
    if (running) return;
    setRunning(true);
    setOutput('Running…');
    try {
      const res = await runPython(code, mission.element === 'Dendro' ? 10000 : 5000);
      const { ok, namespace, stdout, stderr, error } = res;
      if (!ok) {
        setVerdict('fail');
        setOutput((stdout ? stdout + '\n' : '') + (stderr || error || 'Unknown error'));
        setErrorsHit(e => e + 1);
        setFailures([]);
        const msg = await explainError(`${region?.element} region — ${mission.title}`, code, stderr || error || 'unknown');
        setCompanionMsg(msg);
        return;
      }
      const result = verifyMission(mission.successCriteria, namespace);
      setOutput(stdout || '');
      if (result.ok) {
        setVerdict('pass');
        const msg = await celebrate(`${region?.element} region — ${mission.title}`);
        setCompanionMsg(msg);
        // Auto-advance after a beat
      } else {
        setVerdict('fail');
        setFailures(result.failures);
        setErrorsHit(e => e + 1);
        setCompanionMsg(`Almost. The ${region?.element || 'wind'} sees: ${result.failures[0] || 'check your variables'}`);
      }
    } catch (err) {
      setVerdict('fail');
      setOutput(String(err.message || err));
      setErrorsHit(e => e + 1);
      setCompanionMsg(`A storm. ${err.message || err}. Try again, Traveler.`);
    } finally {
      setRunning(false);
    }
  };

  const showHint = () => {
    const next = Math.min(hintIndex + 1, mission.hints.length - 1);
    setHintIndex(next);
    onHintUsed?.();
  };

  const finish = () => {
    const seconds = Math.floor((Date.now() - startedAt) / 1000);
    onComplete({ hintsUsed: hintIndex + 1, errorsHit, secondsTaken: seconds });
  };

  const reset = () => { setCode(mission.starterCode); setVerdict(null); setOutput(''); setFailures([]); };

  const ringColor = region?.color || '#f39c12';

  return (
    <div className="min-h-screen bg-[var(--bg)] text-white p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <button onClick={onBack} className="btn btn-ghost text-sm">← Quest Board</button>
        <div className="text-xs text-slate-400">~{mission.estimatedMinutes} min · +{mission.xpReward} XP</div>
      </div>
      <h1 className="font-display text-xl mb-1" style={{ color: ringColor }}>{mission.title}</h1>
      <p className="text-xs uppercase tracking-wider text-slate-500 mb-3">{mission.concept}</p>

      {/* Companion */}
      <div className="mb-3 p-3 rounded-xl border border-slate-800 bg-[var(--surf)] text-sm leading-relaxed flex gap-3 items-start">
        <span className="text-2xl shrink-0">✨</span>
        <span className="flex-1">{companionMsg}</span>
      </div>

      <CodeEditor value={code} onChange={setCode} onRun={run} disabled={running} />

      <div className="flex gap-2 mt-3 flex-wrap">
        <button className="btn btn-primary" onClick={run} disabled={running}>
          {running ? (warming ? 'Warming Pyodide…' : 'Running…') : (ready ? '▶ Run' : 'Loading Python…')}
        </button>
        <button className="btn btn-ghost" onClick={showHint} disabled={hintIndex >= mission.hints.length - 1}>
          Hint ({Math.min(hintIndex + 2, mission.hints.length)}/{mission.hints.length})
        </button>
        <button className="btn btn-ghost" onClick={reset}>Reset</button>
      </div>

      {hintIndex >= 0 && (
        <div className="mt-3 p-3 rounded-xl border border-slate-700 bg-[#1a2030] text-sm">
          <div className="text-[var(--gold)] text-xs mb-1">Hint {hintIndex + 1}</div>
          <div>{mission.hints[hintIndex]}</div>
        </div>
      )}

      {verdict && (
        <div className="mt-3 p-3 rounded-xl border" style={{ borderColor: verdict === 'pass' ? '#27ae60' : '#e74c3c' }}>
          <div className="font-semibold mb-1" style={{ color: verdict === 'pass' ? '#27ae60' : '#e74c3c' }}>
            {verdict === 'pass' ? '✦ Vision Granted' : '✗ Not yet'}
          </div>
          {output && <pre className="text-xs whitespace-pre-wrap mb-2 text-slate-300">{output}</pre>}
          {failures.map((f, i) => <div key={i} className="text-xs text-rose-300">• {f}</div>)}
          {verdict === 'pass' && (
            <button className="btn btn-primary mt-2" onClick={finish}>Claim Vision Fragment →</button>
          )}
        </div>
      )}
    </div>
  );
}
