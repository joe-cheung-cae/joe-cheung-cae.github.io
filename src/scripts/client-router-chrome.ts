import { isTransitionBeforeSwapEvent } from 'astro:transitions/client';
import { applyHtmlChromeState, readHtmlChromeState } from '@/lib/html-chrome';
import { isSearchHotkey } from '@/lib/search-shortcut';

let installed = false;
let chromeAbort: AbortController | undefined;

export function bindPageChrome(signal: AbortSignal): void {
  const openSearch = () => {
    window.dispatchEvent(new CustomEvent('open-search'));
  };

  document.getElementById('search-trigger')?.addEventListener('click', openSearch, { signal });

  document.addEventListener(
    'keydown',
    (event) => {
      if (!isSearchHotkey(event)) return;
      event.preventDefault();
      openSearch();
    },
    { signal }
  );

  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  mobileMenuBtn?.addEventListener(
    'click',
    () => {
      mobileMenu?.classList.toggle('hidden');
    },
    { signal }
  );
}

function persistHtmlChrome(event: Event) {
  if (!isTransitionBeforeSwapEvent(event)) return;
  applyHtmlChromeState(
    event.newDocument.documentElement,
    readHtmlChromeState(document.documentElement)
  );
}

function rebindPageChrome() {
  chromeAbort?.abort();
  chromeAbort = new AbortController();
  bindPageChrome(chromeAbort.signal);
}

/** Idempotent. AbortController rebind on astro:page-load so ⌘K does not leak. */
export function installClientRouterChrome(): void {
  if (installed) return;
  installed = true;

  document.addEventListener('astro:before-swap', persistHtmlChrome);
  document.addEventListener('astro:page-load', rebindPageChrome);
  rebindPageChrome();
}
