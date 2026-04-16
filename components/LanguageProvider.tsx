'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { type Lang } from '@/lib/i18n';

interface LangCtx { lang: Lang; setLang: (l: Lang) => void; }
const Ctx = createContext<LangCtx>({ lang: 'nl', setLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('nl');

  useEffect(() => {
    const stored = localStorage.getItem('sol_lang') as Lang | null;
    if (stored === 'en' || stored === 'nl') setLangState(stored);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem('sol_lang', l);
    document.documentElement.lang = l;
  }

  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export function useLanguage() {
  return useContext(Ctx);
}
