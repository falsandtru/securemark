import { CommentParser } from '../inline';
import { build, combine, surround, transform, Result } from '../../combinator';
import { SubParsers } from '../../combinator/parser';
import { unescsource } from '../source/unescapable';

const syntax = /^<(#+)\s+(?:\S+\s+)*?\1(?=>)/;

export const comment: CommentParser = transform(build(() =>
  surround(syntax, combine<CommentParser>([unescsource]), '')),
  //(_, rest) =>
  (_, rest): Result<never, SubParsers<CommentParser>> =>
    [[], rest]);
