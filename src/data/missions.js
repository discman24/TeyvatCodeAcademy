// Verification spec for missions.
// Supported types: 'number', 'int', 'float', 'str', 'bool', 'list', 'dict', 'tuple'

export const MISSIONS = [
  // ─── WINDHOLM (Anemo / Variables & Types) ─────────────────────────────────
  {
    id: 'windholm-q1', region: 'windholm', element: 'Anemo',
    title: 'Name the Wind', concept: 'Variables & Assignment',
    estimatedMinutes: 8, xpReward: 100,
    brief: "The mountain pass is shrouded in mist. The Bard says: 'To pass, name the wind. Set its direction and speed before the next gust.'",
    starterCode: `# Name the wind. Direction is a word like "North", speed is a number.\nwind_direction = \nwind_speed = \n`,
    successCriteria: {
      wind_direction: { type: 'str', notEmpty: true },
      wind_speed: { type: 'number', min: 0 }
    },
    hints: [
      'Wind direction is a string — wrap it in quotes, e.g. "North".',
      'Wind speed is a number, no quotes. Try a value between 5 and 50.'
    ],
    tutorContext: 'Anemo, variables mission, wind metaphor preferred',
    worldResponse: 'wind'
  },
  {
    id: 'windholm-q2', region: 'windholm', element: 'Anemo',
    title: 'The Weight of Things', concept: 'Data Types',
    estimatedMinutes: 9, xpReward: 100,
    brief: "Cargo arrives at the harbor. Catalogue each good: name, count, weight in kg, and whether it is fragile.",
    starterCode: `# Catalogue the cargo: 4 different types\ngood_name = \ngood_count = \ngood_weight = \nis_fragile = \n`,
    successCriteria: {
      good_name: { type: 'str', notEmpty: true },
      good_count: { type: 'int', min: 1 },
      good_weight: { type: 'float', min: 0 },
      is_fragile: { type: 'bool' }
    },
    hints: [
      'good_count is a whole number — no decimal point.',
      'good_weight should have a decimal: 12.5 not 12.',
      'is_fragile is True or False (capital T/F, no quotes).'
    ],
    tutorContext: 'Anemo, types, merchant metaphor',
    worldResponse: 'wind'
  },
  {
    id: 'windholm-q3', region: 'windholm', element: 'Anemo',
    title: 'Shape-Shifting', concept: 'Type Casting',
    estimatedMinutes: 10, xpReward: 110,
    brief: "The anemometer reads 14.78 m/s. The dial only displays whole numbers. Convert the float to an int — and back to a string for the log.",
    starterCode: `raw = 14.78\n\n# 1. Make 'force_level' the int form of raw\nforce_level = \n\n# 2. Make 'log_entry' a string version of force_level\nlog_entry = \n`,
    successCriteria: {
      force_level: { type: 'int', equals: 14 },
      log_entry: { type: 'str', equals: '14' }
    },
    hints: [
      'Use int(raw) to drop the decimal.',
      'Use str(force_level) to convert a number to text.'
    ],
    tutorContext: 'Anemo, casting, instrument metaphor',
    worldResponse: 'wind'
  },
  {
    id: 'windholm-q4', region: 'windholm', element: 'Anemo',
    title: 'True North', concept: 'Constants & Naming',
    estimatedMinutes: 7, xpReward: 110,
    brief: "Set the four cardinal directions as constants — values that never change in this realm.",
    starterCode: `# By convention, ALL_CAPS = constant in Python\nNORTH = \nEAST = \nSOUTH = \nWEST = \n`,
    successCriteria: {
      NORTH: { type: 'str', notEmpty: true },
      EAST: { type: 'str', notEmpty: true },
      SOUTH: { type: 'str', notEmpty: true },
      WEST: { type: 'str', notEmpty: true }
    },
    hints: [
      'Strings need quotes: NORTH = "N" or NORTH = "North".',
      'All four must be set before running.'
    ],
    tutorContext: 'Anemo, constants, naming convention',
    worldResponse: 'wind'
  },

  // ─── STONESPIRE (Geo / Functions) ─────────────────────────────────────────
  {
    id: 'stonespire-q1', region: 'stonespire', element: 'Geo',
    title: 'Construct a Pillar', concept: 'Defining Functions',
    estimatedMinutes: 10, xpReward: 110,
    brief: "Define a function that builds a Geo pillar. Take height (m) and material (str), return a description.",
    starterCode: `def build_pillar(height, material):\n    # Return e.g. "5m granite pillar"\n    pass\n\nresult = build_pillar(5, "granite")\n`,
    successCriteria: { result: { type: 'str', contains: ['5', 'granite'] } },
    hints: [
      'Replace `pass` with a `return` statement.',
      'Use an f-string: return f"{height}m {material} pillar"'
    ],
    tutorContext: 'Geo, function definition, pillar metaphor',
    worldResponse: 'geo'
  },
  {
    id: 'stonespire-q2', region: 'stonespire', element: 'Geo',
    title: 'The Price of Stone', concept: 'Parameters & Return',
    estimatedMinutes: 12, xpReward: 120,
    brief: "Trade negotiation. Price = base × quantity × (1 - discount). Return the total.",
    starterCode: `def calculate_price(base, quantity, discount=0.0):\n    # discount as 0..1 (10% = 0.1)\n    pass\n\nprice = calculate_price(50, 4, 0.25)  # Expected: 150.0\n`,
    successCriteria: { price: { type: 'number', equals: 150.0 } },
    hints: [
      'Multiply base × quantity × (1 - discount).',
      "Don't forget to `return` the value."
    ],
    tutorContext: 'Geo, parameters, trade metaphor',
    worldResponse: 'geo'
  },
  {
    id: 'stonespire-q3', region: 'stonespire', element: 'Geo',
    title: 'Crystal Echo', concept: 'Multiple Return Values',
    estimatedMinutes: 10, xpReward: 120,
    brief: "A resonance crystal returns its frequency AND its colour. Tuple-unpack the result.",
    starterCode: `def resonate(power):\n    # Return (frequency_hz, colour_name)\n    pass\n\nfreq, colour = resonate(100)\n`,
    successCriteria: {
      freq: { type: 'number', min: 0 },
      colour: { type: 'str', notEmpty: true }
    },
    hints: [
      'Return both: return 440, "amber"',
      'Multiple return values become a tuple automatically.'
    ],
    tutorContext: 'Geo, tuple return, crystal metaphor',
    worldResponse: 'geo'
  },
  {
    id: 'stonespire-q4', region: 'stonespire', element: 'Geo',
    title: "The Archon's Contract", concept: 'Default Parameters',
    estimatedMinutes: 9, xpReward: 120,
    brief: "Write a contract function. Default duration = 1 year, default penalty = 100.",
    starterCode: `def contract(party, duration=1, penalty=100):\n    return f"{party}: {duration}y, penalty {penalty}"\n\nstandard = contract("Eric")\ncustom   = contract("Eric", duration=5, penalty=500)\n`,
    successCriteria: {
      standard: { type: 'str', contains: ['Eric', '1', '100'] },
      custom:   { type: 'str', contains: ['Eric', '5', '500'] }
    },
    hints: [
      'The function is written — just run it.',
      'Defaults activate when you omit the keyword argument.'
    ],
    tutorContext: 'Geo, default parameters, contract metaphor',
    worldResponse: 'geo'
  },

  // ─── STORMKEEP (Electro / Conditionals) ───────────────────────────────────
  {
    id: 'stormkeep-q1', region: 'stormkeep', element: 'Electro',
    title: 'The Vision Trial', concept: 'if / elif / else',
    estimatedMinutes: 10, xpReward: 130,
    brief: "Score 80+ = pass, 60+ = retry, else = fail.",
    starterCode: `def vision_trial(score):\n    # Return "pass", "retry", or "fail"\n    pass\n\nresult = vision_trial(85)  # should be "pass"\n`,
    successCriteria: { result: { type: 'str', equals: 'pass' } },
    hints: [
      'Use if score >= 80: return "pass"',
      'Then elif score >= 60: return "retry"',
      'Then else: return "fail"'
    ],
    tutorContext: 'Electro, if/elif/else, vision trial metaphor',
    worldResponse: 'electro'
  },
  {
    id: 'stormkeep-q2', region: 'stormkeep', element: 'Electro',
    title: 'The Sakoku Edict', concept: 'Boolean Logic',
    estimatedMinutes: 10, xpReward: 130,
    brief: "Entry requires a permit AND clearance, AND you must NOT be on the blacklist.",
    starterCode: `def can_enter(has_permit, has_clearance, is_blacklisted):\n    pass\n\nallowed = can_enter(True, True, False)\ndenied  = can_enter(True, True, True)\n`,
    successCriteria: {
      allowed: { type: 'bool', equals: true },
      denied:  { type: 'bool', equals: false }
    },
    hints: [
      'Combine: has_permit and has_clearance and not is_blacklisted',
      "`not is_blacklisted` flips True/False."
    ],
    tutorContext: 'Electro, boolean and/or/not, entry rules',
    worldResponse: 'electro'
  },
  {
    id: 'stormkeep-q3', region: 'stormkeep', element: 'Electro',
    title: 'Thunderfall', concept: 'Nested Conditionals',
    estimatedMinutes: 12, xpReward: 140,
    brief: "Lightning chooses the tallest target — but only if it is not insulated.",
    starterCode: `def will_strike(height_m, is_insulated):\n    # Strike if height > 10 AND not insulated\n    pass\n\nstrike1 = will_strike(15, False)\nstrike2 = will_strike(15, True)\nstrike3 = will_strike(5, False)\n`,
    successCriteria: {
      strike1: { type: 'bool', equals: true },
      strike2: { type: 'bool', equals: false },
      strike3: { type: 'bool', equals: false }
    },
    hints: [
      'Use a single if statement with both conditions.',
      'return height_m > 10 and not is_insulated'
    ],
    tutorContext: 'Electro, nested conditionals, lightning metaphor',
    worldResponse: 'electro'
  },
  {
    id: 'stormkeep-q4', region: 'stormkeep', element: 'Electro',
    title: 'Resistance Protocol', concept: 'Match Statement',
    estimatedMinutes: 12, xpReward: 140,
    brief: "Sentry classifies threats: 'low' → log, 'medium' → alert, 'high' → engage, otherwise → ignore.",
    starterCode: `def respond(threat):\n    match threat:\n        case "low":\n            return "log"\n        case "medium":\n            return "alert"\n        case "high":\n            return "engage"\n        case _:\n            return "ignore"\n\na = respond("medium")\nb = respond("typo")\n`,
    successCriteria: {
      a: { type: 'str', equals: 'alert' },
      b: { type: 'str', equals: 'ignore' }
    },
    hints: [
      'The code is mostly written — just run it.',
      'Pyodide supports the match statement (Python 3.10+).'
    ],
    tutorContext: 'Electro, match statement, sentry metaphor',
    worldResponse: 'electro'
  }
];

export const missionsByRegion = (rid) => MISSIONS.filter(m => m.region === rid);
export const missionById = (id) => MISSIONS.find(m => m.id === id);
