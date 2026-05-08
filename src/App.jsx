import { useState } from 'react';
import { useProgress } from './hooks/useProgress';
import WorldMap from './components/WorldMap';
import QuestBoard from './components/QuestBoard';
import MissionRunner from './components/MissionRunner';
import Onboarding from './components/Onboarding';
import InstallPrompt from './components/InstallPrompt';
import { missionById } from './data/missions';

export default function App() {
  const { state, completedByRegion, completeQuest, setName, incrementHint, resetAll } = useProgress();
  const [view, setView] = useState({ name: 'home' }); // home | region | mission
  const [activeMissionId, setActiveMissionId] = useState(null);

  if (!state.travelerName) {
    return (
      <>
        <Onboarding onStart={setName} />
        <InstallPrompt accent="#f39c12" appName="Teyvat Code Academy" />
      </>
    );
  }

  if (view.name === 'mission' && activeMissionId) {
    const mission = missionById(activeMissionId);
    if (!mission) return null;
    return (
      <>
        <MissionRunner
          mission={mission}
          onHintUsed={() => incrementHint(mission.id)}
          onComplete={(stats) => {
            completeQuest(mission, stats);
            setActiveMissionId(null);
            setView({ name: 'region', regionId: mission.region });
          }}
          onBack={() => { setActiveMissionId(null); setView({ name: 'region', regionId: mission.region }); }}
        />
        <InstallPrompt accent="#f39c12" appName="Teyvat Code Academy" />
      </>
    );
  }

  if (view.name === 'region' && view.regionId) {
    return (
      <>
        <QuestBoard
          regionId={view.regionId}
          completedQuests={state.completedQuests}
          onPickQuest={(m) => { setActiveMissionId(m.id); setView({ name: 'mission' }); }}
          onBack={() => setView({ name: 'home' })}
        />
        <InstallPrompt accent="#f39c12" appName="Teyvat Code Academy" />
      </>
    );
  }

  return (
    <>
      <WorldMap
        progress={state}
        completedByRegion={completedByRegion}
        onPickRegion={(rid) => setView({ name: 'region', regionId: rid })}
      />
      <div className="max-w-3xl mx-auto px-4 py-3 text-center">
        <button onClick={() => { if (confirm('Reset all progress?')) resetAll(); }} className="text-xs text-slate-500 hover:text-slate-300">Reset progress</button>
      </div>
      <InstallPrompt accent="#f39c12" appName="Teyvat Code Academy" />
    </>
  );
}
