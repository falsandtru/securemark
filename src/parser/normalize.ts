import { body } from './api/body';

export function normalize(source: string): string {
  const rest = body(source);
  const header = source.slice(0, source.length - rest.length);
  return header.replace(/(^|\S)[^\S\n]+(?=$|\n)$/mg, '$1') + rest
    .replace(/\u0000|[\uD800-\uDBFF][\uDC00-\uDFFF]?|[\uDC00-\uDFFF]/g, str =>
      str.length === 1
        ? '\uFFFD'
        : str)
    .replace(/\r\n|[\x00-\x08\x0B-\x1F\x7F]/g, char => {
      assert(!char.match(/^[\n\t]$/));
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
