// app/api/session/verify/route.ts — Tier + usage check (ported from api/session/verify.js)
import { NextRequest, NextResponse } from 'next/server';
import { resolveTier } from '@/lib/tier';
import { checkAndEnforce } from '@/lib/usage';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { sessionId } = body;
  const sid = (typeof sessionId === 'string' ? sessionId.trim() : '') || null;

  const { tier, config, source } = await resolveTier(sid);

  const usageKey = sid || 'anonymous';
  const result = await checkAndEnforce(usageKey, tier, config);

  const usageData = {
    used:       result.used,
    remaining:  result.allowed ? result.limit - result.used : 0,
    limit:      result.limit,
    windowType: config.windowType,
  };

  return NextResponse.json({
    tier,
    canPdf:      config.pdf,
    coverLetter: config.coverLetter,
    usage:       usageData,
    source,
    blocked:     !result.allowed,
  }, { headers: { 'Cache-Control': 'no-store' } });
}
