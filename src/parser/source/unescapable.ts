import { UnescapableSourceParser } from '../source';
import { creator } from '../../combinator';
import { separator } from './text';

export const unescsource: UnescapableSourceParser = creator(source => {
  if (source === '') return;
  const i = source.search(separator);
  switch (i) {
    case -1:
      return [[source], ''];
    case 0:
      return [[source.slice(0, 1)], source.slice(1)];
    default:
      return [[source.slice(0, i)], source.slice(i)];
  }
});
