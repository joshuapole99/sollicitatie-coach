/**
 * /api/review.js
 *
 * Cover letter generation — PLUS and PRO only.
 * PDF export flag — PRO only (enforced here, not in frontend).
 *
 * ✅ Uses same resolveTier() as analyse.js and verify.js
 * ✅ Server-side feature gating
 * ❌ NO duplicate tier logic
 * ❌ NO free tier access
 */

const { resolveTier } = require("./lib/tierResolver");

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
  const { sessionId, vacatureText, cvText, requestPdf } = req.body ?? {};

  if (!sessionId || typeof sessionId !== "string") {
    return res.status(400).json({ error: "sessionId required" });
  }
  if (!vacatureText || !cvText) {
    return res.status(400).json({ error: "vacatureText and cvText required" });
  }

  console.log(`[review] Request for sessionId=${sessionId.slice(0, 8)}… requestPdf=${!!requestPdf}`);

  // ── Resolve tier ──────────────────────────────────────────────────────────
  let resolution;
  try {
    resolution = await resolveTier(sessionId);
  } catch (err) {
    console.error("[review] resolveTier failed:", err.message);
    return res.status(500).json({ error: "Tier resolution failed" });
  }

  const { tier } = resolution;

  // ── GATE: Cover letter = PLUS or PRO only ─────────────────────────────────
  if (tier === "free") {
    console.log(`[review] BLOCKED — tier=free has no cover letter access`);
    return res.status(403).json({
      error: "feature_not_available",
      tier,
      message: "Motivatiebrief generatie is beschikbaar vanaf PLUS (€2,99/maand).",
    });
  }

  // ── GATE: PDF export = PRO only ───────────────────────────────────────────
  if (requestPdf && tier !== "pro") {
    console.log(`[review] BLOCKED PDF — tier=${tier} has no PDF export`);
    return res.status(403).json({
      error: "feature_not_available",
      tier,
      message: "PDF export is exclusief voor PRO (€9,99/maand).",
    });
  }

  // ── Generate cover letter ─────────────────────────────────────────────────
  let coverLetter;
  try {
    coverLetter = await generateCoverLetter({ vacatureText, cvText });
  } catch (err) {
    console.error("[review] Cover letter generation failed:", err.message);
    return res.status(500).json({ error: "Generatie mislukt. Probeer het later opnieuw." });
  }

  // ── Optional: PDF generation (PRO only) ───────────────────────────────────
  let pdfBase64 = null;
  if (requestPdf && tier === "pro") {
    try {
      pdfBase64 = await generatePdf(coverLetter);
      console.log(`[review] PDF generated for sessionId=${sessionId.slice(0, 8)}…`);
    } catch (err) {
      console.error("[review] PDF generation failed:", err.message);
      // Return cover letter without PDF rather than failing completely
      pdfBase64 = null;
    }
  }

  return res.status(200).json({
    success: true,
    tier,
    coverLetter,
    pdf: pdfBase64
      ? { base64: pdfBase64, filename: "motivatiebrief.pdf" }
      : null,
  });
};

// ─── COVER LETTER GENERATOR ───────────────────────────────────────────────────

async function generateCoverLetter({ vacatureText, cvText }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

  const systemPrompt = `Je bent een expert in het schrijven van professionele Nederlandse motivatiebrieven.
Schrijf een op maat gemaakte motivatiebrief op basis van de vacature en het CV.
De brief moet:
- Persoonlijk en specifiek zijn (geen generieke tekst)
- De relevante ervaring uit het CV koppelen aan de vacature-eisen
- Professioneel maar niet stijf klinken
- Maximaal 400 woorden zijn
- In het formaat zijn: aanhef, opening, kern (2 alinea's), afsluiting, groet

Geef ALLEEN de motivatiebrief terug, geen uitleg of meta-commentaar.`;

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
      temperature: 0.5,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

// ─── PDF GENERATOR (PRO only) ─────────────────────────────────────────────────

async function generatePdf(coverLetterText) {
  // Using a lightweight PDF generation approach
  // In production you'd use puppeteer, pdfkit, or a PDF API service
  // This is a placeholder that returns a simple PDF via html-pdf-node or similar

  try {
    // Dynamic import to keep cold starts fast for non-PDF requests
    const PDFDocument = require("pdfkit");
    const { Readable } = require("stream");

    return await new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        margin: 72, // 1 inch margins
        size: "A4",
      });

      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer.toString("base64"));
      });
      doc.on("error", reject);

      // Styling
      doc.font("Helvetica").fontSize(12);

      // Add date
      const today = new Date().toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      doc.text(today, { align: "right" });
      doc.moveDown(2);

      // Cover letter text
      const paragraphs = coverLetterText.split("\n");
      for (const para of paragraphs) {
        if (para.trim()) {
          doc.text(para.trim(), { align: "left" });
          doc.moveDown(0.5);
        } else {
          doc.moveDown(0.5);
        }
      }

      doc.end();
    });
  } catch (err) {
    console.error("[review] PDFKit error:", err.message);
    throw new Error("PDF generation failed");
  }
}
