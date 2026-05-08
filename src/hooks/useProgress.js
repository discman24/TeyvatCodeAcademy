import { useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'teyvat:progress:v1';

const initialState = {
  travelerName: '',
  xp: 0,
  streak: 0,
  visionFragments: { anemo: 0, geo: 0, electro: 0, hydro: 0, pyro: 0, cryo: 0, dendro: 0 },
  completedQuests: [],
  unlockedGuardians: [],
  activeGuardian: null,
  lastActiveDate: null,
  hintsUsedByQuest: {} // questId -> count
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw);
    return { ...initialState, ...parsed, visionFragments: { ...initialState.visionFragments, ...(parsed.visionFragments || {}) } };
  } catch { return initialState; }
}

export function useProgress() {
  const [state, setState] = useState(load);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const completeQuest = useCallback((quest, { hintsUsed = 0, errorsHit = 0, secondsTaken = 999 } = {}) => {
    setState(prev => {
      if (prev.completedQuests.includes(quest.id)) return prev;
      const elem = (quest.element || 'anemo').toLowerCase();
      const fragments = { ...prev.visionFragments, [elem]: (prev.visionFragments[elem] || 0) + 1 };
      let xpGain = quest.xpReward;
      if (hintsUsed === 0) xpGain += 50;
      if (errorsHit === 0) xpGain += 75;
      if (secondsTaken < 600) xpGain += 25;
      // Streak update
      const today = new Date().toISOString().slice(0, 10);
      const last = prev.lastActiveDate;
      let streak = prev.streak;
      if (last !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        streak = (last === yesterday) ? streak + 1 : 1;
      }
      // Region complete? unlock guardian
      const regionQuests = prev.completedQuests.concat(quest.id).filter(id => id.startsWith(quest.region + '-'));
      const guardians = (regionQuests.length >= 4 && !prev.unlockedGuardians.includes(quest.region))
        ? [...prev.unlockedGuardians, quest.region]
        : prev.unlockedGuardians;
      return {
        ...prev,
        xp: prev.xp + xpGain,
        completedQuests: [...prev.completedQuests, quest.id],
        visionFragments: fragments,
        unlockedGuardians: guardians,
        lastActiveDate: today,
        streak
      };
    });
  }, []);

  const setName = useCallback((name) => setState(s => ({ ...s, travelerName: name })), []);
  const setActiveGuardian = useCallback((g) => setState(s => ({ ...s, activeGuardian: g })), []);
  const incrementHint = useCallback((qid) => setState(s => ({ ...s, hintsUsedByQuest: { ...s.hintsUsedByQuest, [qid]: (s.hintsUsedByQuest[qid] || 0) + 1 } })), []);
  const resetAll = useCallback(() => { localStorage.removeItem(STORAGE_KEY); setState(initialState); }, []);

  // Derived: count completed by region
  const completedByRegion = state.completedQuests.reduce((acc, id) => {
    const r = id.split('-')[0]; acc[r] = (acc[r] || 0) + 1; return acc;
  }, {});

  return { state, completedByRegion, completeQuest, setName, setActiveGuardian, incrementHint, resetAll };
}
