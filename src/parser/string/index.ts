export function makeIndex(text: string): string {
  return `index:${text.trim().replace(/\s+/g, '-')}`;
}
