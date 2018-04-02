import { TextParser } from '../source';
import { html } from 'typed-dom';

const separator = /[^0-9a-zA-Z\u0080-\uFFFF]|[\u0300-\u036F]|(?:[0-9a-zA-Z][!?]*h|\?h|[0-9a-gi-zA-Z!?])ttps?:|[0-9a-zA-Z@]?@[0-9a-zA-Z]|[、。]/;

export const text: TextParser = source => {
  if (source.length === 0) return;
  const i = source.search(separator);
  switch (i) {
    case -1:
      return [[document.createTextNode(source)], ''];
    case 0:
      switch (source[0]) {
        case '\\':
          switch (source[1]) {
            case '\n':
              return [[html('br')], source.slice(2)];
            default:
              return [[document.createTextNode(source.slice(1, 2))], source.slice(2)];
          }
        case '、':
        case '。':
        case '！':
        case '？':
          switch (source[1]) {
            case '\n':
              return [[document.createTextNode(source.slice(0, 1))], source.slice(2)];
            default:
              return [[document.createTextNode(source.slice(0, 1))], source.slice(1)];
          }
        case '\n':
          return [[html('span', { class: 'newline' }, ' ')], source.slice(1)];
        default:
          return [[document.createTextNode(source.slice(0, 1))], source.slice(1)];
      }
    default:
      return [[document.createTextNode(source.slice(0, i))], source.slice(i)];
  }
};
