import { Parser, SubParsers } from '../parser';
import { union } from './union';
import { sequence } from './sequence';

export function tails<P extends Parser>(parsers: Parser.SubParsers<P>): P;
export function tails<T>(parsers: SubParsers<T>): Parser<T> {
  return union(parsers.map((_, i) => sequence(parsers.slice(i))));
}
