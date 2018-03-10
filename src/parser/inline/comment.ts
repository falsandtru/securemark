import { CommentParser } from '../inline';
import { combine, surround, transform, Result } from '../../combinator';
import { SubParsers } from '../../combinator/parser';
import { unescsource } from '../source/unescapable';

const syntax = /^<(#+)\s+(?:\S+\s+)*?\1(?=>)/;

export const comment: CommentParser = source =>
  transform(
    surround(
      syntax,
      combine<CommentParser>([unescsource]),
      ''),
    //(_, rest) =>
    (_, rest): Result<never, SubParsers<CommentParser>> =>
      [[], rest])
    (source);
