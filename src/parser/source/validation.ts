export function match(source: string, start: string, syntax?: RegExp): boolean {
  return source.startsWith(start)
      && (!syntax || source.search(syntax) === 0);
}

export function isVisible(source: string): boolean {
  return source.trim() !== '';
}

export function isTightVisible(source: string): boolean {
  return isVisible(source)
      && source === source.trim();
}

export function isSingleLine(source: string): boolean {
  return !source.includes('\n');
}
