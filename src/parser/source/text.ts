import { undefined } from 'spica/global';
import { TextParser } from '../source';
import { creator } from '../../combinator';
import { str } from './str';
import { html } from 'typed-dom';

export const separator = /\s|[\x00-\x7F]|\S#/;
export const alphanumeric = /^[A-Za-z0-9]+/;
const next = /[\S\n]|$/;
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
          const i = b ? source.search(next) : 0;
          assert(i !== -1);
          assert(!['\\', '\n'].includes(source[0]));
          const r = !b && source.match(alphanumeric);
          if (r) return [[r[0]], source.slice(r[0].length)];
          return i === source.length
              || source[i] === '\n'
              || source[i] === '\\' && source[i + 1] === '\n'
            ? [[], source.slice(i)]
            : [[source.slice(0, i || 1)], source.slice(i || 1)];
      }
    default:
      return [[source.slice(0, i)], source.slice(i)];
  }
});
