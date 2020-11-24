import { undefined } from 'spica/global';
import { TextParser } from '../source';
import { creator } from '../../combinator';
import { str } from './str';
import { html } from 'typed-dom';

export const separator = /[\s\x00-\x7F]/;
export const nonAlphanumeric = /[^0-9A-Za-z]|$/;
const nonWhitespace = /[\S\n]|$/;
const repeat = str(/^(.)\1*/);

export const text: TextParser = creator(source => {
  if (source === '') return;
  const i = source.search(separator);
  switch (i) {
    case -1:
      return [[source], ''];
    case 0:
      switch (source[0]) {
        case '\\':
          switch (source[1]) {
            case undefined:
              return [[], ''];
            case '\n':
              return [[html('span', { class: 'linebreak' }, ' ')], source.slice(2)];
            default:
              return [[source.slice(1, 2)], source.slice(2)];
          }
        case '\n':
          return [[html('br')], source.slice(1)];
        case '*':
        case '+':
        case '~':
        case '=':
        case '$':
          return source[1] === source[0]
            ? repeat(source, {})
            : [[source[0]], source.slice(1)];
        default:
          const b = source[0].trimStart() === '';
          const i = b || isAlphanumeric(source[0])
            ? source.search(b ? nonWhitespace : nonAlphanumeric)
            : 1;
          assert(i > 0);
          assert(!['\\', '\n'].includes(source[0]));
          return b && i === source.length
              || b && source[i] === '\n'
              || b && source[i] === '\\' && source[i + 1] === '\n'
            ? [[], source.slice(i)]
            : [[source.slice(0, i)], source.slice(i)];
      }
    default:
      return [[source.slice(0, i)], source.slice(i)];
  }
});

export function isAlphanumeric(char: string): boolean {
  assert(char.length === 1);
  return '0' <= char && char <= '9'
      || 'a' <= char && char <= 'z'
      || 'A' <= char && char <= 'Z';
}
