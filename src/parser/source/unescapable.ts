import { UnescapableSourceParser } from '../source';
import { creator } from '../../combinator';
import { separator, nonWhitespace, nonAlphanumeric, isAlphanumeric } from './text';

export const unescsource: UnescapableSourceParser = creator(source => {
  assert(source[0] !== '\x7F');
  if (source === '') return;
  const i = source.search(separator);
  switch (i) {
    case -1:
      return [[source], ''];
    case 0: {
      const b = source[0] !== '\n' && source[0].trimStart() === '';
      const i = b || isAlphanumeric(source[0])
        ? source.search(b ? nonWhitespace : nonAlphanumeric)
        : 1;
      assert(i > 0);
      return [[source.slice(0, i)], source.slice(i)];
    }
    default:
      return [[source.slice(0, i)], source.slice(i)];
  }
});
