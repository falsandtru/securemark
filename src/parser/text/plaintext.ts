import { Result } from '../../parser';
import { PlainTextParser, Zalgo } from '../text';
import { zalgo } from './zalgo/plaintext';

const separator = /`|<\/code>|\n|[\u0300-\u036F]/i;

export const plaintext: PlainTextParser = function (source: string): Result<Text, [Zalgo.ZalgoPlainTextParser]> {
  if (source.length === 0) return;
  const i = source.search(separator);
  switch (i) {
    case -1:
      return [[document.createTextNode(source)], ''];
    case 0:
      return zalgo(source)
          || [[document.createTextNode(source.slice(0, 1))], source.slice(1)];
    default:
      return [[document.createTextNode(source.slice(0, i))], source.slice(i)];
  }
};
