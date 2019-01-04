import { TextParser } from '../source';
import { html, text as txt } from 'typed-dom';

export const separator = /(?=[\x00-\x7F])[^a-zA-Z0-9]|\s|(?!h?ttps?:)[a-zA-Z0-9!?][!?]*h?ttps?:|[a-zA-Z0-9][a-zA-Z0-9.+_-]*@[a-zA-Z0-9]|[a-zA-Z0-9]+#/;

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
          return [[txt(source.slice(0, 1))], source.slice(1)];
      }
    default:
      return [[txt(source.slice(0, i))], source.slice(i)];
  }
};
