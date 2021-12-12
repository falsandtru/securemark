import { EscapableSourceParser } from '../source';
import { creator } from '../../combinator';
import { nonWhitespace, nonAlphanumeric, isAlphanumeric } from './text';

const separator = /[\s\x00-\x2F\x3A-\x40\x5B-\x60\x7B-\x7F]/;

export const escsource: EscapableSourceParser = creator(source => {
  assert(source[0] !== '\x7F');
  if (source === '') return;
  const i = source.search(separator);
  switch (i) {
    case -1:
      return [[source], ''];
    case 0:
      switch (source[0]) {
        case '\\':
          return [[source.slice(0, 2)], source.slice(2)];
        default:
          const b = source[0] !== '\n' && source[0].trimStart() === '';
          const i = b || isAlphanumeric(source[0])
            ? source.search(b ? nonWhitespace : nonAlphanumeric)
            : 1;
          assert(i > 0);
          return [[source.slice(0, i)], source.slice(i)];
      }
    default:
      return [[source.slice(0, i)], source.slice(i)];
  }
});
