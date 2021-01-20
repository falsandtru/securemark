import { ParagraphParser } from '../../block';
import { subsequence, some, block } from '../../../combinator';
import { anchor } from './mention/anchor';
import { quote } from './mention/quote';

export const mention: ParagraphParser.MentionParser = block(
  subsequence([
    some(anchor),
    quote,
  ]),
  false);
