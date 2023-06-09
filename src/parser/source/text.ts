import { TextParser, TxtParser, LinebreakParser } from '../source';
import { union, creation, focus } from '../../combinator';
import { str } from './str';
import { html } from 'typed-dom/dom';

export const delimiter = /[\s\x00-\x7F（）]|\S[#>]/u;
export const nonWhitespace = /[\S\n]|$/u;
export const nonAlphanumeric = /[^0-9A-Za-z]|\S[#>]|$/u;
const repeat = str(/^(.)\1*/);

export const text: TextParser = creation(1, false, ({ source, context }) => {
  if (source === '') return;
  const i = source.search(delimiter);
  switch (i) {
    case -1:
      return [[source], ''];
    case 0:
      switch (source[0]) {
        case '\r':
          assert(!source.includes('\r', 1));
          context.resources && ++context.resources.clock;
          return [[], source.slice(1)];
        case '\x1B':
        case '\\':
          switch (source[1]) {
            case undefined:
            case '\n':
              assert(source[0] !== '\x1B');
              return [[], source.slice(1)];
            default:
              return [[source.slice(1, 2)], source.slice(2)];
          }
        case '\n':
          return [[html('br')], source.slice(1)];
        case '*':
        case '+':
        case '~':
        case '=':
        case '`':
          return source[1] === source[0]
            ? repeat({ source, context })
            : [[source[0]], source.slice(1)];
        default:
          assert(source[0] !== '\n');
          const b = source[0].trimStart() === '';
          const i = b || isAlphanumeric(source[0])
            ? source.search(b ? nonWhitespace : nonAlphanumeric) || 1
            : 1;
          assert(i > 0);
          assert(!['\\', '\n'].includes(source[0]));
          return b && i === source.length
              || b && source[i] === '\n'
              || b && source[i] === '\\' && source[i + 1] === '\n'
            ? [[], source.slice(i)]
            : [[source.slice(0, i - +b || 1)], source.slice(i - +b || 1)];
      }
    default:
      return [[source.slice(0, i)], source.slice(i)];
  }
});

export const txt: TxtParser = union([
  text,
]) as TxtParser;

export const linebreak: LinebreakParser = focus(/^[\r\n]/, union([
  text,
])) as LinebreakParser;

export function isAlphanumeric(char: string): boolean {
  assert(char.length === 1);
  if (char < '0' || '\x7F' < char) return false;
  return '0' <= char && char <= '9'
      || 'a' <= char && char <= 'z'
      || 'A' <= char && char <= 'Z';
}
