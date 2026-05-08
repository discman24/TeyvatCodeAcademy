import { useState } from 'react';

export default function Onboarding({ onStart }) {
  const [name, setName] = useState('');
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg)] text-white">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">🌬️</div>
        <h1 className="font-display text-3xl text-[var(--gold)] mb-2">Teyvat Code Academy</h1>
        <p className="text-slate-300 text-sm mb-6">
          You arrive in a fantasy world with no Vision — no power. Master the Seven Elements of Python to find your lost sibling. Each region grants a Vision. Each Vision is a Python concept made real.
        </p>
        <input
          className="w-full px-4 py-3 rounded-xl bg-[var(--surf)] border border-slate-700 text-center font-display text-lg mb-3 outline-none focus:border-[var(--gold)]"
          placeholder="Your traveler name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
        />
        <button
          className="btn btn-primary w-full text-lg"
          disabled={!name.trim()}
          onClick={() => onStart(name.trim())}
        >
          Begin the Journey →
        </button>
        <p className="text-xs text-slate-500 mt-4">Sessions take 15 minutes. Tap the share menu to add this app to your Home Screen.</p>
      </div>
    </div>
  );
}
