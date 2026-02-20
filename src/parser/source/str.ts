import { StrParser } from '../source';
import { Parser } from '../../combinator/data/parser';
import { matcher } from '../../combinator';

export function str(pattern: string | RegExp): StrParser;
export function str(pattern: string | RegExp): Parser<string> {
  return matcher(pattern, true);
}

export function strs(pattern: string): StrParser;
export function strs(pattern: string): Parser<string> {
  assert(pattern);
  return ({ context }) => {
    const { source } = context;
    let acc = '';
    while (context.position < source.length && source.startsWith(pattern, context.position)) {
      acc += pattern;
      context.position += pattern.length;
    }
    return [[acc]];
  };
}
