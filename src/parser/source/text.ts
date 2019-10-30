import { TextParser } from '../source';
import { html, text as txt } from 'typed-dom';

export const separator = /\s|(?=[^a-zA-Z0-9\s])[\x00-\x7F]|[a-zA-Z0-9][a-zA-Z0-9.+_-]*@[a-zA-Z0-9]|\S#/;
const next = /[\S\n]|$/;

export const text: TextParser = (source, config) => {
  if (source === '') return;
  const i = source.search(separator);
  switch (i) {
    case -1:
      return [[txt(source)], '', config];
    case 0:
      switch (source[0]) {
        case '\\':
          switch (source[1]) {
            case '\n':
              return [[html('span', { class: 'linebreak' }, ' ')], source.slice(2), config];
            default:
              return [[txt(source.slice(1, 2))], source.slice(2), config];
          }
        case '\n':
          return [[html('br')], source.slice(1), config];
        default:
          assert(source[0] !== '\n');
          const i = source.slice(0, 2).trim() === '' ? source.search(next) : 0;
          assert(i !== -1);
          return i === source.length || source[i] === '\n'
            ? [[], source.slice(i), config]
            : [[txt(source.slice(0, i || 1))], source.slice(i || 1), config];
      }
    default:
      return [[txt(source.slice(0, i))], source.slice(i), config];
  }
};
