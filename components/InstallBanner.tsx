'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { T } from '@/lib/i18n';

type Mode = 'android' | 'ios' | null;

export default function InstallBanner() {
  const { lang } = useLanguage();
  const t = T[lang];
  const [mode, setMode] = useState<Mode>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Don't show if already running as installed app
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    // Don't show if dismissed recently
    const dismissed = localStorage.getItem('sol_install_dismissed');
    if (dismissed && Date.now() - Number(dismissed) < 7 * 24 * 60 * 60 * 1000) return;

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window.navigator as any).standalone;
    if (isIos) { setMode('ios'); return; }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setMode('android');
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => setMode(null));
  }

  function handleDismiss() {
    localStorage.setItem('sol_install_dismissed', String(Date.now()));
    setMode(null);
  }

  if (!mode) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
      background: 'linear-gradient(135deg,#0f172a,#1e3a8a)',
      borderTop: '1px solid rgba(255,255,255,.1)',
      padding: '14px 20px',
      paddingBottom: 'max(14px, env(safe-area-inset-bottom))',
      display: 'flex', alignItems: 'center', gap: 14,
      boxShadow: '0 -4px 20px rgba(0,0,0,.25)',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
        background: 'linear-gradient(135deg,#2563eb,#4f46e5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22,
      }}>📋</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{t.installTitle}</p>
        <p style={{ fontSize: 12, color: '#94a3b8' }}>
          {mode === 'ios' ? t.installIosHint : t.installSub}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button onClick={handleDismiss} style={{
          background: 'none', border: '1px solid rgba(255,255,255,.2)',
          color: '#94a3b8', fontSize: 13, padding: '7px 12px',
          borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
        }}>{t.installDismiss}</button>

        {mode === 'android' && (
          <button onClick={handleInstall} style={{
            background: 'linear-gradient(135deg,#2563eb,#4f46e5)',
            border: 'none', color: '#fff', fontSize: 13, fontWeight: 700,
            padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
          }}>{t.installBtn}</button>
        )}
      </div>
    </div>
  );
}
