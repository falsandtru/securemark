import { Result } from '../../parser';
import { PlainTextParser } from '../inline';

const separator = /`|<\/code>|\n/i;

export const plaintext: PlainTextParser = function (source: string): Result<Text, never> {
  if (source.length === 0) return;
  const i = source.search(separator);
  switch (i) {
    case -1:
      return [[document.createTextNode(source)], ''];
    case 0:
      return [[document.createTextNode(source.slice(0, 1))], source.slice(1)];
    default:
      return [[document.createTextNode(source.slice(0, i))], source.slice(i)];
  }
};
