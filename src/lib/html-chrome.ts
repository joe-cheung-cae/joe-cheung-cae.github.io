export type HtmlChromeState = {
  dark: boolean;
  lang: 'en' | 'zh' | null;
};

type ReadableHtml = {
  classList: { contains(token: string): boolean };
  getAttribute(name: string): string | null;
};

type WritableHtml = {
  classList: { toggle(token: string, force?: boolean): boolean };
  setAttribute(name: string, value: string): void;
};

export function readHtmlChromeState(el: ReadableHtml): HtmlChromeState {
  const lang = el.getAttribute('data-lang');
  return {
    dark: el.classList.contains('dark'),
    lang: lang === 'zh' || lang === 'en' ? lang : null,
  };
}

export function applyHtmlChromeState(el: WritableHtml, state: HtmlChromeState): void {
  el.classList.toggle('dark', state.dark);
  if (state.lang !== 'en' && state.lang !== 'zh') return;
  el.setAttribute('data-lang', state.lang);
  el.setAttribute('lang', state.lang === 'zh' ? 'zh-Hans' : 'en');
}
