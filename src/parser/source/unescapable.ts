import { UnescapableSourceParser } from '../source';
import { Command } from '../context';
import { consume } from '../../combinator';
import { delimiter, nonWhitespace, nonAlphanumeric, isAlphanumeric } from './text';

export const unescsource: UnescapableSourceParser = ({ source, context }) => {
  if (source === '') return;
  const i = source.search(delimiter);
  switch (i) {
    case -1:
      consume(source.length, context);
      return [[source], ''];
    case 0: {
      consume(1, context);
      switch (source[0]) {
        case '\r':
          assert(!source.includes('\r', 1));
          consume(-1, context);
          return [[], source.slice(1)];
        case Command.Escape:
          assert(false);
          consume(1, context);
          return [[source.slice(1, 2)], source.slice(2)];
        case '\n':
          context.linebreak ??= source.length;
          return [[source[0]], source.slice(1)];
        default:
          assert(source[0] !== '\n');
          const b = source[0].trimStart() === '';
          const i = b || isAlphanumeric(source[0])
            ? source.search(b ? nonWhitespace : nonAlphanumeric) || 1
            : 1;
          assert(i > 0);
          consume(i - 1, context);
          return [[source.slice(0, i - +b || 1)], source.slice(i - +b || 1)];
      }
    }
    default:
      consume(i, context);
      return [[source.slice(0, i)], source.slice(i)];
  }
};
