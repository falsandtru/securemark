import { CommentParser } from '../inline';
import { capture } from '../../combinator';

export const comment: CommentParser = capture(
  /^<(#+)\s+(?:\S+\s+)*?\1>/,
  (_, r) => [[], r]);
