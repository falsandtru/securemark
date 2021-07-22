import { ParagraphParser } from '../../block';
import { inits, some, validate } from '../../../combinator';
import { cite } from './mention/cite';
import { quote } from './mention/quote';

export const mention: ParagraphParser.MentionParser = validate('>', inits([
  some(cite),
  quote,
]));
