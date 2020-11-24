import { UnescapableSourceParser } from '../source';
import { creator } from '../../combinator';
import { separator, nonAlphanumeric, isAlphanumeric } from './text';

export const unescsource: UnescapableSourceParser = creator(source => {
  if (source === '') return;
  const i = source.search(separator);
  switch (i) {
    case -1:
      return [[source], ''];
    case 0: {
      const i = isAlphanumeric(source[0])
        ? source.search(nonAlphanumeric)
        : 1;
      assert(i > 0);
      return [[source.slice(0, i)], source.slice(i)];
    }
    default:
      return [[source.slice(0, i)], source.slice(i)];
  }
});
