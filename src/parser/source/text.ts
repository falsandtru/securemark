import { TextParser } from '../source';
import { html, text as txt } from 'typed-dom';

const separator = /[^0-9a-zA-Z\u0080-\uFFFF]|[\u0300-\u036F]|(?!h?ttps?:)[0-9a-zA-Z][!?]*h?ttps?:|[0-9a-zA-Z]@[a-zA-Z0-9]/;

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
