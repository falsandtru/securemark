import { CommentParser } from '../inline';
import { union, match } from '../../combinator';
import '../source/unescapable';

export const comment: CommentParser = union<CommentParser>([
  match(
    /^<(#+)\s+(?:\S+\s+)*?\1>/,
    (_, r) => [[], r]),
  match(
    /^<!(-{2,})\s+(?:\S+\s+)*?\1>/,
    (_, r) => [[], r]),
]);
