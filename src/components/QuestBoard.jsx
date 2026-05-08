import { REGIONS } from '../data/regions';
import { missionsByRegion } from '../data/missions';
import { GUARDIANS } from '../data/guardians';

export default function QuestBoard({ regionId, completedQuests, onPickQuest, onBack }) {
  const region = REGIONS.find(r => r.id === regionId);
  if (!region) return null;
  const missions = missionsByRegion(regionId);
  const guardian = GUARDIANS[regionId];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-white p-4 sm:p-6 max-w-3xl mx-auto">
      <button onClick={onBack} className="btn btn-ghost mb-4">← World Map</button>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{region.icon}</span>
        <h1 className="font-display text-2xl" style={{ color: region.color }}>{region.name}</h1>
      </div>
      <p className="text-sm text-slate-400 mb-4">{region.element} · {region.domain}</p>
      {guardian && (
        <div className="mb-5 p-3 rounded-xl border border-slate-800 bg-[var(--surf)]">
          <div className="text-xs uppercase tracking-wider text-slate-500">Guardian</div>
          <div className="font-display text-lg" style={{ color: region.color }}>{guardian.name}</div>
          <div className="text-xs text-slate-300">{guardian.passive}</div>
          <div className="text-xs italic text-slate-400 mt-1">"{guardian.quote}"</div>
        </div>
      )}

      <div className="space-y-2">
        {missions.length === 0 && (
          <div className="text-slate-400 text-sm italic">Quests for this region are still being charted. Check back soon, Traveler.</div>
        )}
        {missions.map((m, i) => {
          const done = completedQuests.includes(m.id);
          return (
            <button key={m.id} onClick={() => onPickQuest(m)}
              className="w-full text-left p-3 rounded-xl border bg-[var(--surf)] hover:bg-[#1d242e] transition flex items-center gap-3"
              style={{ borderColor: done ? region.color : '#2a3140' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-display text-sm" style={{ background: done ? region.color : 'rgba(0,0,0,0.4)', color: done ? '#0a0a14' : region.color }}>
                {done ? '✓' : i + 1}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{m.title}</div>
                <div className="text-xs text-slate-400">{m.concept}</div>
              </div>
              <div className="text-right text-xs">
                <div className="text-[var(--gold)]">+{m.xpReward} XP</div>
                <div className="text-slate-500">~{m.estimatedMinutes}m</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
