import { EscapableSourceParser } from '../source';
import { text } from 'typed-dom';

const separator = /\s|(?=[\x00-\x7F])[^a-zA-Z0-9\s]/;

export const escsource: EscapableSourceParser = (source, state) => {
  if (source === '') return;
  const i = source.search(separator);
  switch (i) {
    case -1:
      return [[text(source)], '', state];
    case 0:
      switch (source[0]) {
        case '\\':
          return [[text(source.slice(0, 2))], source.slice(2), state];
        default:
          return [[text(source.slice(0, 1))], source.slice(1), state];
      }
    default:
      return [[text(source.slice(0, i))], source.slice(i), state];
  }
};
