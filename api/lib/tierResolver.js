/**
 * tierResolver.js — SINGLE SOURCE OF TRUTH for tier logic
 *
 * ✅ Used by: analyse.js, review.js, session/verify.js
 * ❌ NO duplicate tier logic anywhere else
 * ❌ NO client-side enforcement
 * ❌ NO fallback free resets
 */

const { kv } = require("@vercel/kv");

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const TIER_CONFIG = {
  free: {
    maxAnalyses: 3,
    windowType: "lifetime",
    label: "FREE",
  },
  plus: {
    maxAnalyses: 10,
    windowType: "monthly",
    label: "PLUS",
  },
  pro: {
    maxAnalyses: 100,
    windowType: "monthly",
    label: "PRO",
  },
};

// Map LemonSqueezy variant/product IDs → tier
// Fill in your actual variant IDs from LemonSqueezy dashboard
const LEMONSQUEEZY_PRODUCT_MAP = {
  [process.env.LS_VARIANT_PLUS]: "plus",   // €2,99/month variant ID
  [process.env.LS_VARIANT_PRO]: "pro",     // €9,99/month variant ID
};

// ─── LEMONSQUEEZY SUBSCRIPTION CHECK ─────────────────────────────────────────

/**
 * Fetches the active LemonSqueezy subscription for a sessionId.
 * Returns tier string: 'free' | 'plus' | 'pro'
 */
async function fetchLemonSqueezyTier(sessionId) {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;

  if (!apiKey || !storeId) {
    console.warn("[TierResolver] Missing LemonSqueezy env vars — defaulting to free");
    return "free";
  }

  try {
    // Look up subscription by custom data (sessionId stored at checkout)
    const url = `https://api.lemonsqueezy.com/v1/subscriptions?filter[store_id]=${storeId}&filter[status]=active`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/vnd.api+json",
      },
    });

    if (!res.ok) {
      console.error(`[TierResolver] LemonSqueezy API error: ${res.status}`);
      return "free";
    }

    const data = await res.json();
    const subscriptions = data?.data ?? [];

    // Find subscription linked to this sessionId via custom data
    for (const sub of subscriptions) {
      const customData = sub?.attributes?.custom_data;
      const variantId = String(sub?.attributes?.variant_id ?? "");
      const status = sub?.attributes?.status;

      const sessionMatch =
        customData?.sessionId === sessionId ||
        customData?.session_id === sessionId;

      if (sessionMatch && status === "active") {
        const tier = LEMONSQUEEZY_PRODUCT_MAP[variantId] ?? "free";
        console.log(`[TierResolver] LS match → variantId=${variantId} → tier=${tier}`);
        return tier;
      }
    }

    console.log(`[TierResolver] No active LS subscription found for sessionId=${sessionId}`);
    return "free";
  } catch (err) {
    console.error("[TierResolver] LemonSqueezy fetch failed:", err.message);
    return "free";
  }
}

// ─── USAGE KEY HELPERS ────────────────────────────────────────────────────────

function getLifetimeKey(sessionId) {
  return `usage:lifetime:${sessionId}`;
}

function getMonthlyKey(sessionId) {
  const now = new Date();
  const month = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  return `usage:monthly:${sessionId}:${month}`;
}

// ─── USAGE TRACKING ───────────────────────────────────────────────────────────

/**
 * Returns current usage count for a session based on tier window type.
 */
async function getUsageCount(sessionId, windowType) {
  try {
    if (windowType === "lifetime") {
      const val = await kv.get(getLifetimeKey(sessionId));
      return Number(val ?? 0);
    } else {
      const val = await kv.get(getMonthlyKey(sessionId));
      return Number(val ?? 0);
    }
  } catch (err) {
    console.error("[TierResolver] getUsageCount error:", err.message);
    return 0;
  }
}

/**
 * Increments usage count. Returns new count.
 * FREE tier: increments lifetime counter (never resets)
 * PLUS/PRO: increments monthly counter (auto-resets via key rotation)
 */
async function incrementUsage(sessionId, windowType) {
  try {
    if (windowType === "lifetime") {
      const key = getLifetimeKey(sessionId);
      const newVal = await kv.incr(key);
      return newVal;
    } else {
      const key = getMonthlyKey(sessionId);
      const newVal = await kv.incr(key);
      // Set TTL to 35 days so monthly keys auto-expire
      await kv.expire(key, 35 * 24 * 60 * 60);
      return newVal;
    }
  } catch (err) {
    console.error("[TierResolver] incrementUsage error:", err.message);
    throw new Error("Usage tracking failed");
  }
}

// ─── MAIN RESOLVER ────────────────────────────────────────────────────────────

/**
 * resolveTier(sessionId) — THE only function that determines tier + limits.
 *
 * Returns:
 * {
 *   tier: 'free' | 'plus' | 'pro',
 *   limits: { maxAnalyses: number, windowType: 'lifetime' | 'monthly' },
 *   usage: { current: number, remaining: number, exceeded: boolean },
 *   lsResponse: object | null  (for debug logging)
 * }
 */
async function resolveTier(sessionId) {
  if (!sessionId || typeof sessionId !== "string" || sessionId.length < 10) {
    throw new Error("Invalid sessionId");
  }

  // 1. Determine tier from LemonSqueezy
  const tier = await fetchLemonSqueezyTier(sessionId);
  const config = TIER_CONFIG[tier];

  // 2. Get current usage
  const currentUsage = await getUsageCount(sessionId, config.windowType);

  // 3. Calculate remaining + exceeded
  const remaining = Math.max(0, config.maxAnalyses - currentUsage);
  const exceeded = currentUsage >= config.maxAnalyses;

  // 4. Full debug log
  console.log("[TierResolver] Resolution complete:", {
    sessionId: sessionId.slice(0, 8) + "…",
    tier,
    windowType: config.windowType,
    maxAnalyses: config.maxAnalyses,
    currentUsage,
    remaining,
    exceeded,
    decidedAt: new Date().toISOString(),
  });

  return {
    tier,
    limits: {
      maxAnalyses: config.maxAnalyses,
      windowType: config.windowType,
    },
    usage: {
      current: currentUsage,
      remaining,
      exceeded,
    },
  };
}

// ─── EXPORTS ──────────────────────────────────────────────────────────────────

module.exports = {
  resolveTier,
  incrementUsage,
  TIER_CONFIG,
};
