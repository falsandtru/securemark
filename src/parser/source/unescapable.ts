import { UnescapableSourceParser } from '../source';
import { separator } from './text';
import { text } from 'typed-dom';

export const unescsource: UnescapableSourceParser = source => {
  if (source === '') return;
  const i = source.search(separator);
  switch (i) {
    case -1:
      return [[text(source)], ''];
    case 0:
      return [[text(source.slice(0, 1))], source.slice(1)];
    default:
      return [[text(source.slice(0, i))], source.slice(i)];
  }
};
