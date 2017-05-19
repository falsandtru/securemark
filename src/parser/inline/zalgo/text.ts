import { Result } from '../../../parser';
import { Zalgo } from '../../inline';

const syntax = /^(?:\\?[\u0300-\u036F])+/;

export const zalgo: Zalgo.ZalgoTextParser = function (source: string): Result<Text, [never]> {
  if (source.search(syntax) !== 0) return;
  return [[document.createTextNode(source.startsWith('\\') ? source[1] : source[0])], source.replace(syntax, '')];
};
