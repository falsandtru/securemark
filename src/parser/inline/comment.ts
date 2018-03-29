import { CommentParser } from '../inline';
import { combine, surround, transform } from '../../combinator';
import { unescsource } from '../source/unescapable';

const syntax = /^<(#+)\s+(?:\S+\s+)*?\1(?=>)/;

export const comment: CommentParser = transform(
  surround(syntax, combine<CommentParser>([unescsource]), ''),
  (_, rest) =>
    [[], rest]);
