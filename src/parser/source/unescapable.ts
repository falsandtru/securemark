import { UnescapableSourceParser } from '../source';
import { creator } from '../../combinator';
import { separator, alphanumeric } from './text';

export const unescsource: UnescapableSourceParser = creator(source => {
  if (source === '') return;
  const i = source.search(separator);
  switch (i) {
    case -1:
      return [[source], ''];
    case 0:
      const r = source.match(alphanumeric);
      if (r) return [[r[0]], source.slice(r[0].length)];
      return [[source.slice(0, 1)], source.slice(1)];
    default:
      return [[source.slice(0, i)], source.slice(i)];
  }
});
