import { undefined } from 'spica/global';
import { EscapeParser } from '../inline';
import { union } from '../../combinator';
import { str } from '../source';

const repeat = str(/^(.)\1*/);

export const escape: EscapeParser = union([({ source, context }) => {
  switch (source[0]) {
    case '+':
    case '~':
    case '=':
      if (!source[2]) return;
      return source[2] === source[0]
          && source[1] === source[0]
        ? repeat({ source, context })
        : undefined;
    default:
      return;
  }
}]);
