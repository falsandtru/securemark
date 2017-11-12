import { Result } from '../../combinator/parser';
import { BackquoteParser } from '../source';

export const backquote: BackquoteParser = function (source: string): Result<Text, [never]> {
  switch (source[0]) {
    case '`':
      return [[document.createTextNode(source.slice(0, 1))], source.slice(1)];
    default:
      return;
  }
};

