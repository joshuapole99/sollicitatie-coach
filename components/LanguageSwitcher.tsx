'use client';

import { useLanguage } from './LanguageProvider';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div style={{ display: 'flex', gap: 2, background: '#f1f5f9', borderRadius: 8, padding: 3 }}>
      {(['nl', 'en'] as const).map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          style={{
            padding: '4px 10px',
            fontSize: 12,
            fontWeight: 700,
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all .15s',
            background: lang === l ? 'linear-gradient(135deg,#2563eb,#4f46e5)' : 'transparent',
            color: lang === l ? '#fff' : '#64748b',
            boxShadow: lang === l ? '0 1px 4px rgba(79,70,229,.3)' : 'none',
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
