/**
 * /api/analyse.js
 *
 * Enforces tier limits BEFORE running analysis.
 * Uses shared resolveTier() — identical logic to verify.js.
 *
 * ✅ Server enforces limits
 * ✅ Increments usage only on success
 * ❌ NO client-side limit checks allowed
 * ❌ NO free tier reset ever
 */

const { resolveTier, incrementUsage } = require("./lib/tierResolver");

module.exports = async function handler(req, res) {
  // ── CORS ──────────────────────────────────────────────────────────────────
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN ?? "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  const { sessionId, vacatureText, cvText } = req.body ?? {};

  if (!sessionId || typeof sessionId !== "string") {
    return res.status(400).json({ error: "sessionId required" });
  }
  if (!vacatureText || !cvText) {
    return res.status(400).json({ error: "vacatureText and cvText required" });
  }

  console.log(`[analyse] Request for sessionId=${sessionId.slice(0, 8)}…`);

  // ── Resolve tier + check limits ───────────────────────────────────────────
  let resolution;
  try {
    resolution = await resolveTier(sessionId);
  } catch (err) {
    console.error("[analyse] resolveTier failed:", err.message);
    return res.status(500).json({ error: "Tier resolution failed" });
  }

  const { tier, limits, usage } = resolution;

  // ── ENFORCE LIMIT (server-side, always) ───────────────────────────────────
  if (usage.exceeded) {
    console.log(`[analyse] BLOCKED — tier=${tier} limit=${limits.maxAnalyses} used=${usage.current}`);
    return res.status(403).json({
      error: "limit_exceeded",
      tier,
      message: buildLimitMessage(tier, limits),
      usage,
      limits,
    });
  }

  // ── Run analysis via OpenAI ───────────────────────────────────────────────
  let analysisResult;
  try {
    analysisResult = await runAnalysis({ vacatureText, cvText, tier });
  } catch (err) {
    console.error("[analyse] OpenAI call failed:", err.message);
    return res.status(500).json({ error: "Analysis failed. Try again later." });
  }

  // ── Increment usage ONLY after successful analysis ────────────────────────
  try {
    const newCount = await incrementUsage(sessionId, limits.windowType);
    console.log(`[analyse] Usage incremented → ${newCount}/${limits.maxAnalyses} (${tier})`);
  } catch (err) {
    console.error("[analyse] incrementUsage failed:", err.message);
    // Still return the result — don't punish the user for a tracking glitch
    // But log it for investigation
  }

  return res.status(200).json({
    success: true,
    tier,
    analysis: analysisResult,
    usage: {
      current: usage.current + 1,
      remaining: Math.max(0, limits.maxAnalyses - (usage.current + 1)),
      max: limits.maxAnalyses,
      windowType: limits.windowType,
    },
  });
};

// ─── LIMIT MESSAGE BUILDER ────────────────────────────────────────────────────

function buildLimitMessage(tier, limits) {
  if (tier === "free") {
    return `Je hebt je ${limits.maxAnalyses} gratis analyses gebruikt. Upgrade naar PLUS of PRO voor meer.`;
  }
  if (tier === "plus") {
    return `Je hebt je ${limits.maxAnalyses} maandelijkse analyses bereikt. Upgrade naar PRO voor 100/maand.`;
  }
  if (tier === "pro") {
    return `Je hebt je ${limits.maxAnalyses} maandelijkse analyses bereikt. Je limiet reset volgende maand.`;
  }
  return "Analyse limiet bereikt.";
}

// ─── ANALYSIS FUNCTION ────────────────────────────────────────────────────────

async function runAnalysis({ vacatureText, cvText, tier }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

  const systemPrompt = `Je bent een professionele sollicitatie coach. Analyseer de match tussen de vacature en het CV.
Geef altijd terug:
1. Match score (0-100) met uitleg
2. Keyword analyse (aanwezig / ontbrekend)
3. Sterke punten van het CV voor deze vacature
4. Zwakke punten / verbeterpunten
5. Concrete CV-verbeter tips

Formatteer als JSON met keys: matchScore, matchExplanation, keywords, strengths, weaknesses, cvTips.`;

  const userPrompt = `VACATURE:\n${vacatureText}\n\nCV:\n${cvText}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content;

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Failed to parse OpenAI JSON response");
  }
}
