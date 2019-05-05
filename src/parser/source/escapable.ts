import { EscapableSourceParser } from '../source';
import { escapable } from './text';
import { text } from 'typed-dom';

const separator = /\s|(?=[\x00-\x7F])[^a-zA-Z0-9\s]/;

export const escsource: EscapableSourceParser = source => {
  if (source === '') return;
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
              return source.length === 1 || source[1].match(escapable)
                ? [[text(source.slice(0, 2))], source.slice(2)]
                : [[text(source.slice(0, 1))], source.slice(1)];
          }
        default:
          return [[text(source.slice(0, 1))], source.slice(1)];
      }
    default:
      return [[text(source.slice(0, i))], source.slice(i)];
  }
};
