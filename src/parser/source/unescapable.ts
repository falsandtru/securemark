import { UnescapableSourceParser } from '../source';
import { creation } from '../../combinator';
import { delimiter, nonWhitespace, nonAlphanumeric, isAlphanumeric } from './text';

export const unescsource: UnescapableSourceParser = creation(source => {
  assert(source[0] !== '\x1B');
  if (source === '') return;
  const i = source.search(delimiter);
  switch (i) {
    case -1:
      return [[source], ''];
    case 0: {
      const b = source[0] !== '\n' && source[0].trimStart() === '';
      const i = b || isAlphanumeric(source[0])
        ? source.search(b ? nonWhitespace : nonAlphanumeric) || 1
        : 1;
      assert(i > 0);
      return [[source.slice(0, i - +b || 1)], source.slice(i - +b || 1)];
    }
    default:
      return [[source.slice(0, i)], source.slice(i)];
  }
});
