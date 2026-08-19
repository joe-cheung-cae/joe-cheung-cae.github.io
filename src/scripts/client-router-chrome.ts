import { isTransitionBeforeSwapEvent } from 'astro:transitions/client';
import { applyHtmlChromeState, readHtmlChromeState } from '@/lib/html-chrome';
import { notesMenuIsOpen, nextNotesMenuClassName } from '@/lib/notes-drawer';
import { isSearchHotkey } from '@/lib/search-shortcut';

let installed = false;
let chromeAbort: AbortController | undefined;

function setNotesMenuOpen(open: boolean): void {
  const menu = document.getElementById('notes-menu');
  const toggle = document.getElementById('menu-toggle');
  const backdrop = document.getElementById('notes-menu-backdrop');
  if (!menu) return;

  menu.className = nextNotesMenuClassName(menu.className, open);
  toggle?.setAttribute('aria-expanded', open ? 'true' : 'false');
  backdrop?.classList.toggle('is-open', open);
  document.body.classList.toggle('notes-menu-lock', open);
}

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

  const menuToggle = document.getElementById('menu-toggle');
  const notesMenu = document.getElementById('notes-menu');
  const backdrop = document.getElementById('notes-menu-backdrop');

  if (notesMenu) setNotesMenuOpen(false);

  menuToggle?.addEventListener(
    'click',
    () => {
      if (!notesMenu) return;
      setNotesMenuOpen(!notesMenuIsOpen(notesMenu.className));
    },
    { signal }
  );

  backdrop?.addEventListener(
    'click',
    () => {
      setNotesMenuOpen(false);
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
