import { EscapableSourceParser } from '../source';
import { creator } from '../../combinator';
import { nonWhitespace } from './text';

const delimiter = /[\s\x00-\x2F\x3A-\x40\x5B-\x60\x7B-\x7F]/;

export const escsource: EscapableSourceParser = creator(source => {
  if (source === '') return;
  const i = source.search(delimiter);
  switch (i) {
    case -1:
      return [[source], ''];
    case 0:
      switch (source[0]) {
        case '\x1B':
          return [[source.slice(1, 2)], source.slice(2)];
        case '\\':
          return [[source.slice(0, 2)], source.slice(2)];
        default:
          const b = source[0] !== '\n' && source[0].trimStart() === '';
          const i = b
            ? source.search(nonWhitespace)
            : 1;
          assert(i > 0);
          return [[source.slice(0, i)], source.slice(i)];
      }
    default:
      return [[source.slice(0, i)], source.slice(i)];
  }
});
