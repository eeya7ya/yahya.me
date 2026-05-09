"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Lang } from "@/lib/i18n";

type Ctx = { lang: Lang; setLang: (l: Lang) => void };
const LangCtx = createContext<Ctx | null>(null);

export function LangProvider({
  children,
  initialLang = "en",
}: {
  children: React.ReactNode;
  initialLang?: Lang;
}) {
  const [lang, setLang] = useState<Lang>(initialLang);

  // Re-sync if the URL-derived initialLang changes (e.g. on client-side navigation
  // between EN and AR routes within the same provider lifetime).
  useEffect(() => {
    setLang(initialLang);
  }, [initialLang]);

  // Belt-and-suspenders: keep <html lang/dir> in sync if anything mutates them.
  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang }), [lang]);
  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export function useLang(): Lang {
  const ctx = useContext(LangCtx);
  return ctx?.lang ?? "en";
}

export function useLangCtx(): Ctx {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useLangCtx must be used inside <LangProvider>");
  return ctx;
}
