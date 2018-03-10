import { CommentParser } from '../inline';
import { combine, some, bracket, transform, Result } from '../../combinator';
import { SubParsers } from '../../combinator/parser';
import { unescsource } from '../source/unescapable';
import { match } from '../source/validation';

const syntax = /^<(#+)\s*(?:\S+\s+)*?\1>/;

export const comment: CommentParser = source => {
  if (!match(source, '<#')) return;
  const [whole = '', keyword = ''] = source.match(syntax) || [];
  if (!whole) return;
  if (whole.startsWith(`<${keyword} ${keyword}>`)) return [[], source.slice(whole.length)];
  return transform(
    bracket(
      new RegExp(`<${keyword}\\s`),
      some(combine<CommentParser>([unescsource]), new RegExp(`\\s${keyword}>`)),
      new RegExp(`\\s${keyword}>`)),
    //(_, rest) =>
    (_, rest): Result<never, SubParsers<CommentParser>> =>
      [[], rest])
    (source);
};
