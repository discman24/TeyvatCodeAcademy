# Teyvat Code Academy

A Genshin-inspired Python learning RPG (**original IP, no Genshin assets**).
Built for Xavier — sessions ≤15 min, 7 elemental regions, 28 quests total.

## Stack
- Vite 6 + React 18 + Tailwind CDN
- Pyodide 0.27.5 in Web Worker (5s timeout, sandboxed)
- vite-plugin-pwa (Workbox, manifest auto-injected — single source of truth)
- Optional Gemini Flash tutor (`VITE_GEMINI_API_KEY`)

## Develop
```bash
npm install
npm run dev
```

## Deploy (Vercel)
1. Import this repo in Vercel
2. Framework auto-detected: Vite
3. (Optional) Set env var `VITE_GEMINI_API_KEY`

## PWA
- Installable on iOS/Android/Desktop
- Service worker auto-updates
- Pyodide CDN cached for offline play after first run

## Mission Status
- **Windholm** (Anemo, Variables) — 4 quests playable
- **Stonespire** (Geo, Functions) — 4 quests playable
- **Stormkeep** (Electro, Conditionals) — 4 quests playable
- **Tidalport** (Hydro, Loops) — preview unlocked after Anemo 50%
- **Emberveil**, **Frostmantle**, **Verdanspire** — locked, content shipping in next pass

## IP Compliance
Zero miHoYo / HoYoverse / Genshin Impact assets, names, music, or UI. Original archetypes only.
