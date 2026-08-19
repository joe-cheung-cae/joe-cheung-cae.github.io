import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { applyHtmlChromeState, readHtmlChromeState } from './html-chrome.ts';

function fakeHtml(dark: boolean, lang: string | null) {
  const attrs = new Map<string, string>();
  if (lang) attrs.set('data-lang', lang);
  const classes = new Set(dark ? ['dark'] : []);
  return {
    classList: {
      contains: (token: string) => classes.has(token),
      toggle: (token: string, force?: boolean) => {
        if (force) classes.add(token);
        else classes.delete(token);
        return classes.has(token);
      },
    },
    getAttribute: (name: string) => attrs.get(name) ?? null,
    setAttribute: (name: string, value: string) => {
      attrs.set(name, value);
    },
    snapshot: () => ({
      dark: classes.has('dark'),
      lang: attrs.get('data-lang') ?? null,
      htmlLang: attrs.get('lang') ?? null,
    }),
  };
}

describe('html chrome persist', () => {
  test('reads dark class and data-lang', () => {
    const el = fakeHtml(true, 'zh');
    assert.deepEqual(readHtmlChromeState(el), { dark: true, lang: 'zh' });
  });

  test('copies theme and lang onto the incoming document', () => {
    const incoming = fakeHtml(false, 'en');
    applyHtmlChromeState(incoming, { dark: true, lang: 'zh' });
    assert.deepEqual(incoming.snapshot(), {
      dark: true,
      lang: 'zh',
      htmlLang: 'zh-Hans',
    });
  });

  test('clears dark when the current page is light', () => {
    const incoming = fakeHtml(true, 'en');
    applyHtmlChromeState(incoming, { dark: false, lang: 'en' });
    assert.deepEqual(incoming.snapshot(), {
      dark: false,
      lang: 'en',
      htmlLang: 'en',
    });
  });
});
