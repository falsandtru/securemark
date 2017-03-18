import { Result } from '../../parser';
import { TextParser } from '../inline';

const separator = /[^0-9a-zA-Z\u0080-\uFFFF]|[0-9a-zA-Z]?h?ttps?:|[0-9a-zA-Z@]?@[0-9a-zA-Z]/;
const linebreaks = /^(?:(?:\\?\s)*?\\?\n)+/;

export const text: TextParser = function (source: string): Result<HTMLElement | Text, never> {
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
              return [[document.createElement('br')], source.replace(linebreaks, '')];
            default:
              return [[document.createTextNode(source.slice(1, 2))], source.slice(2)];
          }
        case '\n':
          return [[document.createTextNode(' ')], source.slice(1)];
        default:
          return [[document.createTextNode(source.slice(0, 1))], source.slice(1)];
      }
    default:
      return [[document.createTextNode(source.slice(0, i))], source.slice(i)];
  }
};
