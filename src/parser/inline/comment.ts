import { CommentParser } from '../inline';
import { union, surround, transform } from '../../combinator';
import { unescsource } from '../source/unescapable';

const syntax = /^<(#+)\s+(?:\S+\s+)*?\1(?=>)/;

export const comment: CommentParser = transform(
  surround<CommentParser>(syntax, union([unescsource]), ''),
  (_, rest) =>
    [[], rest]);
