/**
 * /api/session/verify.js
 *
 * THE single endpoint the frontend calls to learn its tier.
 * Server is ALWAYS single source of truth.
 *
 * ✅ Returns: { tier, usage, limits, features }
 * ❌ Frontend must NEVER derive or cache tier
 */

const { resolveTier } = require("../lib/tierResolver");

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

  // ── Parse sessionId ───────────────────────────────────────────────────────
  const { sessionId } = req.body ?? {};

  if (!sessionId || typeof sessionId !== "string") {
    console.warn("[verify] Missing or invalid sessionId in request body");
    return res.status(400).json({ error: "sessionId required" });
  }

  console.log(`[verify] Request received for sessionId=${sessionId.slice(0, 8)}…`);

  // ── Resolve tier (full debug logging is inside resolveTier) ───────────────
  let resolution;
  try {
    resolution = await resolveTier(sessionId);
  } catch (err) {
    console.error("[verify] resolveTier failed:", err.message);
    return res.status(500).json({ error: "Tier resolution failed" });
  }

  const { tier, limits, usage } = resolution;

  // ── Build feature flags based on tier ────────────────────────────────────
  const features = {
    coverLetter: tier === "plus" || tier === "pro",
    pdfExport: tier === "pro",
    prioritySupport: tier === "pro",
  };

  // ── Final response ────────────────────────────────────────────────────────
  const response = {
    tier,
    limits,
    usage,
    features,
    resolvedAt: new Date().toISOString(),
  };

  console.log("[verify] Responding with:", {
    sessionId: sessionId.slice(0, 8) + "…",
    tier,
    usage,
    features,
  });

  return res.status(200).json(response);
};
