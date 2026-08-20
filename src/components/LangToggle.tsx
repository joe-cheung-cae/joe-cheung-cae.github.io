import { useEffect, useState } from 'preact/hooks';
import {
  LANG_CHANGE_EVENT,
  applyDocumentLang,
  isUiLang,
  readDocumentLang,
  t,
  type UiLang,
} from '@/i18n/ui';

function readStoredLang(): UiLang {
  const saved = localStorage.getItem('lang');
  if (isUiLang(saved)) return saved;
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

function applyLang(lang: UiLang) {
  applyDocumentLang(document.documentElement, lang);
  window.dispatchEvent(new CustomEvent(LANG_CHANGE_EVENT, { detail: { lang } }));
}

export default function LangToggle() {
  const [lang, setLang] = useState<UiLang>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const next = readStoredLang();
    setLang(next);
    applyLang(next);
    setMounted(true);

    const sync = (event: Event) => {
      const detail = (event as CustomEvent<{ lang?: string }>).detail?.lang;
      if (isUiLang(detail)) {
        setLang(detail);
        return;
      }
      setLang(readDocumentLang(document.documentElement));
    };
    window.addEventListener(LANG_CHANGE_EVENT, sync);
    return () => window.removeEventListener(LANG_CHANGE_EVENT, sync);
  }, []);

  const toggle = () => {
    const next: UiLang = lang === 'en' ? 'zh' : 'en';
    setLang(next);
    localStorage.setItem('lang', next);
    applyLang(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="min-h-11 min-w-11 px-2 rounded-md text-xs font-semibold tracking-wide text-notion-text dark:text-notion-text-dark hover:bg-notion-gray dark:hover:bg-notion-gray-dark transition-colors"
      aria-label={lang === 'en' ? t('en', 'switchToChinese') : t('zh', 'switchToEnglish')}
    >
      {mounted ? (lang === 'en' ? '中文' : 'EN') : 'EN'}
    </button>
  );
}
