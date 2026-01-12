import { EscapableSourceParser } from '../source';
import { Recursion } from '../context';
import { creation } from '../../combinator';
import { nonWhitespace } from './text';

const delimiter = /[\s\x00-\x2F\x3A-\x40\x5B-\x60\x7B-\x7F]/;

export const escsource: EscapableSourceParser = creation(1, Recursion.ignore, ({ source, context }) => {
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
          return [[source.slice(1, 2)], source.slice(2)];
        case '\\':
          switch (source[1]) {
            case undefined:
            case '\n':
              return [[source[0]], source.slice(1)];
            default:
              return [[source.slice(0, 2)], source.slice(2)];
          }
        default:
          const b = source[0] !== '\n' && source[0].trimStart() === '';
          const i = b
            ? source.search(nonWhitespace)
            : 1;
          assert(i > 0);
          return [[source.slice(0, i - +b || 1)], source.slice(i - +b || 1)];
      }
    default:
      return [[source.slice(0, i)], source.slice(i)];
  }
});
