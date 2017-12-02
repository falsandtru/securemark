export function makeIndex(text: string): string {
  assert(!text.includes('\n'));
  return `index:${text.trim().replace(/\s+/g, '-')}`;
}
