import { EscapableSourceParser } from '../source';
import { Command } from '../context';
import { consume } from '../../combinator';
import { nonWhitespace } from './text';

const delimiter = /[\s\x00-\x2F\x3A-\x40\x5B-\x60\x7B-\x7F]/;

export const escsource: EscapableSourceParser = ({ source, context }) => {
  if (source === '') return;
  const i = source.search(delimiter);
  switch (i) {
    case -1:
      consume(source.length, context);
      return [[source], ''];
    case 0:
      consume(1, context);
      switch (source[0]) {
        case '\r':
          assert(!source.includes('\r', 1));
          consume(-1, context);
          return [[], source.slice(1)];
        case Command.Escape:
          assert(false);
          consume(1, context);
          return [[source.slice(1, 2)], source.slice(2)];
        case '\\':
          switch (source[1]) {
            case undefined:
              return [[source[0]], ''];
            case '\n':
              return [[source[0]], source.slice(1)];
            default:
              consume(1, context);
              return [[source.slice(0, 2)], source.slice(2)];
          }
        case '\n':
          assert(false);
          return [[source[0]], source.slice(1)];
        default:
          assert(source[0] !== '\n');
          const b = source[0].trimStart() === '';
          const i = b
            ? source.search(nonWhitespace)
            : 1;
          assert(i > 0);
          consume(i - 1, context);
          return [[source.slice(0, i - +b || 1)], source.slice(i - +b || 1)];
      }
    default:
      consume(i, context);
      return [[source.slice(0, i)], source.slice(i)];
  }
};
