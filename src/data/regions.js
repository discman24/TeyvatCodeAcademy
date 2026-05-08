export const REGIONS = [
  { id: 'windholm',    element: 'Anemo',   color: '#4ecdc4', name: 'Windholm',    domain: 'Variables & Types',     guardian: 'The Bard',       icon: '🌬️', x: 50, y: 18 },
  { id: 'stonespire',  element: 'Geo',     color: '#f0c060', name: 'Stonespire',  domain: 'Functions',             guardian: 'The Archon',     icon: '⛰️', x: 30, y: 38 },
  { id: 'stormkeep',   element: 'Electro', color: '#9b59b6', name: 'Stormkeep',   domain: 'Conditionals & Logic',  guardian: 'The Shogun',     icon: '⚡', x: 70, y: 38 },
  { id: 'tidalport',   element: 'Hydro',   color: '#3498db', name: 'Tidalport',   domain: 'Loops',                 guardian: 'The Funerist',   icon: '🌊', x: 30, y: 62 },
  { id: 'emberveil',   element: 'Pyro',    color: '#e74c3c', name: 'Emberveil',   domain: 'Data Structures',       guardian: 'The Mortician',  icon: '🔥', x: 70, y: 62 },
  { id: 'frostmantle', element: 'Cryo',    color: '#ecf0f1', name: 'Frostmantle', domain: 'OOP & Classes',         guardian: 'The Archer',     icon: '❄️', x: 35, y: 84 },
  { id: 'verdanspire', element: 'Dendro',  color: '#27ae60', name: 'Verdanspire', domain: 'Algorithms & Recursion',guardian: 'The Sage',       icon: '🌿', x: 65, y: 84 }
];

export const ADJACENCY = {
  windholm: ['stonespire', 'stormkeep'],
  stonespire: ['windholm', 'tidalport', 'stormkeep'],
  stormkeep: ['windholm', 'stonespire', 'emberveil'],
  tidalport: ['stonespire', 'frostmantle', 'emberveil'],
  emberveil: ['stormkeep', 'tidalport', 'verdanspire'],
  frostmantle: ['tidalport', 'verdanspire'],
  verdanspire: ['emberveil', 'frostmantle']
};

export const RANKS = [
  { name: 'Lost Traveler',   min: 0,    max: 500 },
  { name: 'Wanderer',        min: 501,  max: 1500 },
  { name: 'Adventurer',      min: 1501, max: 3500 },
  { name: 'Knight',          min: 3501, max: 7000 },
  { name: "Archon's Chosen", min: 7001, max: Infinity }
];

export const rankFor = (xp) => RANKS.find(r => xp >= r.min && xp <= r.max) || RANKS[0];

export function regionState(regionId, completedQuestsByRegion) {
  const STARTER = 'windholm';
  const completed = completedQuestsByRegion[regionId] || 0;
  if (completed >= 4) return 'complete';
  if (regionId === STARTER) return 'active';
  if (completed > 0) return 'active';
  const neighbors = Object.entries(ADJACENCY).filter(([k, v]) => v.includes(regionId)).map(([k]) => k);
  for (const n of neighbors) {
    if ((completedQuestsByRegion[n] || 0) >= 2) return 'partial';
  }
  return 'locked';
}
