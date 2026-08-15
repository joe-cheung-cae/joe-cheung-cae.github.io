import { useEffect, useState } from 'preact/hooks';

type Lang = 'en' | 'zh';

function readLang(): Lang {
  const saved = localStorage.getItem('lang');
  if (saved === 'en' || saved === 'zh') return saved;
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

function applyLang(lang: Lang) {
  document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : 'en';
  document.documentElement.dataset.lang = lang;
}

export default function LangToggle() {
  const [lang, setLang] = useState<Lang>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const next = readLang();
    setLang(next);
    applyLang(next);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Lang = lang === 'en' ? 'zh' : 'en';
    setLang(next);
    localStorage.setItem('lang', next);
    applyLang(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="min-h-11 min-w-11 px-2 rounded-md text-xs font-semibold tracking-wide text-notion-text dark:text-notion-text-dark hover:bg-notion-gray dark:hover:bg-notion-gray-dark transition-colors"
      aria-label={lang === 'en' ? 'Switch to Chinese' : '切换到英文'}
    >
      {mounted ? (lang === 'en' ? '中文' : 'EN') : 'EN'}
    </button>
  );
}
