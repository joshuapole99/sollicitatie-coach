'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// Captures UTM params on first visit and stores in localStorage.
// Retrieved later when user upgrades, to track which ad/channel converts.
export default function UtmCapture() {
  const params = useSearchParams();

  useEffect(() => {
    const utm: Record<string, string> = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(key => {
      const val = params.get(key);
      if (val) utm[key] = val;
    });

    if (Object.keys(utm).length > 0) {
      utm.captured_at = new Date().toISOString();
      utm.landing_page = window.location.pathname;
      localStorage.setItem('sol_utm', JSON.stringify(utm));
    }
  }, [params]);

  return null;
}
