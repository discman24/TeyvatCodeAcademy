import { REGIONS, regionState, rankFor } from '../data/regions';

export default function WorldMap({ progress, completedByRegion, onPickRegion }) {
  const rank = rankFor(progress.xp);
  const fragmentsTotal = Object.values(progress.visionFragments).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-white p-4 sm:p-6 max-w-3xl mx-auto">
      <header className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-[var(--gold)] tracking-wide">Teyvat Code Academy</h1>
          <p className="text-xs sm:text-sm text-slate-400">Master Python through 7 elemental regions</p>
        </div>
        <div className="text-right text-xs sm:text-sm">
          <div className="text-[var(--gold)] font-semibold">{rank.name}</div>
          <div className="text-slate-400">{progress.xp} XP · {fragmentsTotal} Fragments</div>
        </div>
      </header>

      {/* SVG world map */}
      <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-b from-[#0a1220] to-[#0d1117] mb-5">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          {/* connections */}
          {Object.entries({
            'windholm-stonespire': [50, 18, 30, 38],
            'windholm-stormkeep':  [50, 18, 70, 38],
            'stonespire-stormkeep':[30, 38, 70, 38],
            'stonespire-tidalport':[30, 38, 30, 62],
            'stormkeep-emberveil': [70, 38, 70, 62],
            'tidalport-emberveil': [30, 62, 70, 62],
            'tidalport-frostmantle':[30, 62, 35, 84],
            'emberveil-verdanspire':[70, 62, 65, 84],
            'frostmantle-verdanspire':[35, 84, 65, 84]
          }).map(([k, [x1, y1, x2, y2]]) => (
            <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#243046" strokeWidth="0.4" strokeDasharray="0.6 0.8" />
          ))}
        </svg>
        {REGIONS.map(r => {
          const state = regionState(r.id, completedByRegion);
          const isLocked = state === 'locked';
          const isPartial = state === 'partial';
          const isComplete = state === 'complete';
          const opacity = isLocked ? 0.32 : 1;
          return (
            <button
              key={r.id}
              onClick={() => !isLocked && onPickRegion(r.id)}
              disabled={isLocked}
              className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
              style={{ left: `${r.x}%`, top: `${r.y}%`, opacity }}
            >
              <div
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 flex items-center justify-center transition ${isLocked ? '' : 'group-hover:scale-110'} ${isComplete ? 'glow' : isPartial ? 'shimmer' : ''}`}
                style={{ background: 'rgba(15,18,30,0.7)', borderColor: r.color, color: r.color }}
              >
                <span className="text-xl sm:text-2xl">{r.icon}</span>
                {isComplete && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--gold)]" />}
                {isLocked && <span className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center text-xs">🔒</span>}
              </div>
              <div className="text-[10px] sm:text-xs text-center mt-1 font-display tracking-wide" style={{ color: r.color }}>{r.name}</div>
            </button>
          );
        })}
      </div>

      <div className="grid gap-2">
        {REGIONS.map(r => {
          const state = regionState(r.id, completedByRegion);
          const completed = completedByRegion[r.id] || 0;
          return (
            <button key={r.id} onClick={() => state !== 'locked' && onPickRegion(r.id)} disabled={state === 'locked'}
              className="flex items-center gap-3 px-3 py-2 rounded-xl border bg-[var(--surf)] disabled:opacity-40 hover:bg-[#1d242e] transition text-left"
              style={{ borderColor: state === 'locked' ? '#2a3140' : r.color }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)', color: r.color }}>{r.icon}</div>
              <div className="flex-1">
                <div className="font-display text-sm" style={{ color: r.color }}>{r.name}</div>
                <div className="text-xs text-slate-400">{r.element} · {r.domain}</div>
              </div>
              <div className="text-xs text-slate-300 tabular-nums">{completed}/4</div>
              <div className="text-[10px] text-slate-500 uppercase">{state}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
