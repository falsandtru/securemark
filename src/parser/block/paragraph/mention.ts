import { ParagraphParser } from '../../block';
import { inits, some, block } from '../../../combinator';
import { address } from './mention/address';
import { quote } from './mention/quote';

export const mention: ParagraphParser.MentionParser = block(inits([
  address,
  some(quote),
]), false);
