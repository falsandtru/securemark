import { ParagraphParser } from '../../block';
import { subsequence, some, validate } from '../../../combinator';
import { anchor } from './mention/anchor';
import { quote } from './mention/quote';

export const mention: ParagraphParser.MentionParser = validate('>', subsequence([
  some(anchor),
  quote,
]));
