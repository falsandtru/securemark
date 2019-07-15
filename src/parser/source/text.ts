import { TextParser } from '../source';
import { html, text as txt } from 'typed-dom';

export const separator = /\s|(?=[\x00-\x7F])[^a-zA-Z0-9\s]|[a-zA-Z0-9][a-zA-Z0-9.+_-]*@[a-zA-Z0-9]|\S#/;
const next = /[\S\n]|$/;

export const text: TextParser = source => {
  if (source === '') return;
  const i = source.search(separator);
  switch (i) {
    case -1:
      return [[txt(source)], ''];
    case 0:
      switch (source[0]) {
        case '\\':
          switch (source[1]) {
            case '\n':
              return [[html('span', { class: 'linebreak' }, ' ')], source.slice(2)];
            default:
              return [[txt(source.slice(1, 2))], source.slice(2)];
          }
        case '\n':
          return [[html('br')], source.slice(1)];
        default:
          assert(source[0] !== '\n');
          const i = source.slice(0, 2).trim() === '' ? source.search(next) : 0;
          assert(i !== -1);
          return i === source.length || source[i] === '\n'
            ? [[], source.slice(i)]
            : [[txt(source.slice(0, i || 1))], source.slice(i || 1)];
      }
    default:
      return [[txt(source.slice(0, i))], source.slice(i)];
  }
};
