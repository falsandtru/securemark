const reg = /\r\n|[\x00-\x08\x0B-\x1F\x7F]/g;

export function normalize(source: string): string {
  return source
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]?|[\uDC00-\uDFFF]/g, str =>
      str.length === 2
        ? str
        : '')
    .replace(reg, char => {
      assert(!source.match(/^[\n\t]$/));
      switch (char) {
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
