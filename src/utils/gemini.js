// Gemini Flash — companion AI tutor for Teyvat Code Academy.
// Falls back to canned in-character lines if no API key is configured.

const SYSTEM_PROMPT = `You are a small magical companion spirit in a fantasy world (Teyvat Code Academy — original IP, NOT Genshin Impact). You are enthusiastic, occasionally dramatic, and deeply loyal to the Traveler. You explain Python errors using elemental metaphors from the world (wind, stone, lightning, water, fire, ice, nature). You NEVER use real Genshin Impact names, characters, or references. You speak in 2-3 sentences max. You never break character. When you don't know something, say "The winds haven't told me that yet."`;

const FALLBACK = {
  greeting: "The winds whisper of your arrival, Traveler. Shall we begin?",
  hint: "I sense the path is hidden in the syntax — read your code line by line, like a stanza.",
  error: "A storm in the code. Look for the line number — that's where the lightning struck.",
  success: "Vision granted. The wind sings your name."
};

function getApiKey() {
  try {
    return import.meta.env?.VITE_GEMINI_API_KEY || '';
  } catch { return ''; }
}

export async function askCompanion(prompt, context = '') {
  const apiKey = getApiKey();
  if (!apiKey) {
    return FALLBACK.hint;
  }
  try {
    const body = {
      contents: [{ parts: [{ text: `${context ? 'Context: ' + context + '\n' : ''}${prompt}` }] }],
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: { temperature: 0.85, maxOutputTokens: 180 }
    };
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    );
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || FALLBACK.hint;
  } catch {
    return FALLBACK.error;
  }
}

export async function explainError(missionContext, code, errorMsg) {
  const prompt = `The Traveler is on a quest in ${missionContext}. Their code:\n\n${code}\n\nError:\n${errorMsg}\n\nIn one elemental metaphor and one practical tip, explain what went wrong. Two sentences max.`;
  return askCompanion(prompt, missionContext);
}

export async function celebrate(missionContext) {
  const prompt = `The Traveler completed a quest in ${missionContext}. Celebrate in one sentence using an elemental metaphor.`;
  return askCompanion(prompt, missionContext);
}
