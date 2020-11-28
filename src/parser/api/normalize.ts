export function normalize(source: string): string {
  return source
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]?|[\uDC00-\uDFFF]/g, str =>
      str.length === 1
        ? '\uFFFD'
        : str)
    .replace(/\r\n|[\x00-\x08\x0B-\x1F\x7F]/g, char => {
      assert(!char.match(/^[\n\t]$/));
      switch (char) {
        case '\0':
        case '\r':
        case '\v':
        case '\f':
        case '\r\n':
          return '\n';
        default:
          return '';
      }
    });
}
