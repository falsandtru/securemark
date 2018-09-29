import { UnescapableSourceParser } from '../source';
import { text } from 'typed-dom';

const separator = /(?=[\x00-\x7F])[^a-zA-Z0-9]|\s/;

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
