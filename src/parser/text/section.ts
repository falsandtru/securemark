export function section(str: string): string {
  return `section:${str.trim().replace(/\s+/g, '-')}`;
}
