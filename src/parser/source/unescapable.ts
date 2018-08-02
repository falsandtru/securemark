import { UnescapableSourceParser } from '../source';
import { text } from 'typed-dom';

const separator = /[^0-9a-zA-Z\u0080-\uFFFF]/;

export const unescsource: UnescapableSourceParser = source => {
  if (source.length === 0) return;
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
