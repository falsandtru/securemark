import { StrParser } from '../source';
import { Parser, List, Node } from '../../combinator/data/parser';
import { matcher } from '../../combinator';

export function str(pattern: string | RegExp, verify?: (source: string, position: number, range: number) => boolean): StrParser;
export function str(pattern: string | RegExp, verify?: (source: string, position: number, range: number) => boolean): Parser<string> {
  return matcher(pattern, true, verify);
}

export function strs(pattern: string): StrParser;
export function strs(pattern: string): Parser<string> {
  assert(pattern);
  return ({ context }) => {
    const { source } = context;
    let acc = '';
    for (; context.position < source.length && source.startsWith(pattern, context.position);) {
      acc += pattern;
      context.position += pattern.length;
    }
    return new List([new Node(acc)]);
  };
}
