export const NOTES_DRAWER_BREAKPOINT_PX = 1300;
export const NOTES_MENU_OPEN_CLASS = 'is-open';

export function isNotesDrawerOverlay(viewportWidth: number): boolean {
  return viewportWidth < NOTES_DRAWER_BREAKPOINT_PX;
}

export function notesMenuIsOpen(className: string | null | undefined): boolean {
  if (!className) return false;
  return className.split(/\s+/).includes(NOTES_MENU_OPEN_CLASS);
}

export function nextNotesMenuClassName(
  className: string | null | undefined,
  open?: boolean
): string {
  const tokens = (className ?? '')
    .split(/\s+/)
    .filter((token) => token && token !== NOTES_MENU_OPEN_CLASS);
  const shouldOpen = open ?? !notesMenuIsOpen(className);
  return shouldOpen ? [...tokens, NOTES_MENU_OPEN_CLASS].join(' ') : tokens.join(' ');
}

export function isNotesNavActive(pathname: string, href: string): boolean {
  const normalize = (value: string): string => {
    if (!value) return '/';
    const withSlash = value.startsWith('/') ? value : `/${value}`;
    if (withSlash.length > 1 && withSlash.endsWith('/')) {
      return withSlash.slice(0, -1);
    }
    return withSlash;
  };

  const path = normalize(pathname);
  const target = normalize(href);
  if (target === '/') return path === '/';
  return path === target || path.startsWith(`${target}/`);
}
