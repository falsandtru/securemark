export function makeLabel(text: string): string {
  assert(!text.includes('\n'));
  return `label:${text}`;
}
