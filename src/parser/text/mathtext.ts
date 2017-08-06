import { Result } from '../../combinator/parser';
import { MathTextParser } from '../text';

const separator = /\$|\\|\n/i;

export const mathtext: MathTextParser = function (source: string): Result<Text, [never]> {
  if (source.length === 0) return;
  const i = source.search(separator);
  switch (i) {
    case -1:
      return [[document.createTextNode(source)], ''];
    case 0:
      switch (source[0]) {
        case '\\':
          switch (source[1]) {
            case '\\':
            case '$':
              return [[document.createTextNode(source.slice(0, 2))], source.slice(2)];
            default:
              return [[document.createTextNode(source.slice(0, 1))], source.slice(1)];
          }
        default:
          return [[document.createTextNode(source.slice(0, 1))], source.slice(1)];
      }
    default:
      return [[document.createTextNode(source.slice(0, i))], source.slice(i)];
  }
};
