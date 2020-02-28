import { EscapableSourceParser } from '../source';
import { creator } from '../../combinator';

const separator = /\s|(?=[\x00-\x7F])[^A-Za-z0-9\s]/;

export const escsource: EscapableSourceParser = creator(source => {
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
          return [[source.slice(0, 1)], source.slice(1)];
      }
    default:
      return [[source.slice(0, i)], source.slice(i)];
  }
});
