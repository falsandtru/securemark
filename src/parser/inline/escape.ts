import { undefined } from 'spica/global';
import { EscapeParser } from '../inline';
import { union } from '../../combinator';
import { str } from '../source';

const repeat = str(/^(.)\1*/);

export const escape: EscapeParser = union([({ source, context }) => {
  if (source.length < 3) return;
  switch (source[0]) {
    case '*':
      if (source.length < 4) return;
      assert(source[3]);
      return source[3] === source[0]
          && source[2] === source[0]
          && source[1] === source[0]
        ? repeat({ source, context })
        : undefined;
    case '+':
    case '~':
    case '=':
      assert(source[2]);
      return source[2] === source[0]
          && source[1] === source[0]
        ? repeat({ source, context })
        : undefined;
    default:
      return;
  }
}]);
