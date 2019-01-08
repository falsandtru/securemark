import { TextParser } from '../source';
import { html, text as txt } from 'typed-dom';

export const separator = /\s|(?=[\x00-\x7F])[^a-zA-Z0-9\s]|[a-zA-Z0-9][a-zA-Z0-9.+_-]*@[a-zA-Z0-9]|[a-zA-Z0-9]+#/;
const next = /[\S\n]|$/;

export const text: TextParser = source => {
  if (source.length === 0) return;
  const i = source.search(separator);
  switch (i) {
    case -1:
      return [[txt(source)], ''];
    case 0:
      switch (source[0]) {
        case '\\':
          switch (source[1]) {
            case '\n':
              return [[html('br')], source.slice(2)];
            default:
              return [[txt(source.slice(1, 2))], source.slice(2)];
          }
        case '\n':
          return [[html('span', { class: 'linebreak' }, ' ')], source.slice(1)];
        default:
          assert(source[0] !== '\n');
          const i = source.slice(0, 2).trim() === '' ? source.search(next) : 0;
          return i === source.length
            ? [[], '']
            : i > 0 && source[i] === '\n'
              ? text(source.slice(i))
              : [[txt(source.slice(0, 1))], source.slice(1)];
      }
    default:
      return [[txt(source.slice(0, i))], source.slice(i)];
  }
};
