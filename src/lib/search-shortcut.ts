export function isSearchHotkey(event: {
  metaKey: boolean;
  ctrlKey: boolean;
  key: string;
}): boolean {
  return (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
}
