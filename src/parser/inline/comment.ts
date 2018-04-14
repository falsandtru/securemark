import { CommentParser } from '../inline';
import { match } from '../../combinator';

export const comment: CommentParser = match(
  /^<(#+)\s+(?:\S+\s+)*?\1>/,
  (_, r) => [[], r]);
