import { ParagraphParser } from '../../block';
import { subsequence, some, block } from '../../../combinator';
import { address } from './mention/address';
import { quote } from './mention/quote';

export const mention: ParagraphParser.MentionParser = block(subsequence([
  some(address),
  quote,
]), false);
