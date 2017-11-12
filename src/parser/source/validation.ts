export function validate(source: string, start: string, syntax?: RegExp): boolean {
  return source.startsWith(start)
      && (!syntax || source.search(syntax) === 0);
}
