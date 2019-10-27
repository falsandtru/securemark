import { ParagraphParser } from '../../block';
import { subsequence, some, block } from '../../../combinator';
import { address } from './mention/address';
import { quotation } from './mention/quotation';

export const mention: ParagraphParser.MentionParser = block(
  subsequence([
    some(address),
    quotation,
  ]),
  false);
