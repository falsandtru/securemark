import { EscapableSourceParser } from '../source';
import { text } from 'typed-dom';

const separator = /[^0-9a-zA-Z\u0080-\uFFFF]/;

export const escsource: EscapableSourceParser = source => {
  if (source.length === 0) return;
  const i = source.search(separator);
  switch (i) {
    case -1:
      return [[text(source)], ''];
    case 0:
      switch (source[0]) {
        case '\\':
          switch (source[1]) {
            case '\n':
              return [[text(source.slice(0, 1))], source.slice(1)];
            default:
              return [[text(source.slice(0, 2))], source.slice(2)];
          }
        default:
          return [[text(source.slice(0, 1))], source.slice(1)];
      }
    default:
      return [[text(source.slice(0, i))], source.slice(i)];
  }
};
