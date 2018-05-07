import { CommentParser } from '../inline';
import { union, capture } from '../../combinator';

export const comment: CommentParser = union<CommentParser>([
  capture(
    /^<(#+)\s+(?:\S+\s+)*?\1>/,
    (_, r) => [[], r]),
  capture(
    /^<!(-{2,})\s+(?:\S+\s+)*?\1>/,
    (_, r) => [[], r]),
]);
