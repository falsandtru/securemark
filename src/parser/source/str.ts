import { StrParser } from '../source';
import { Parser, List, Node } from '../../combinator/data/parser';
import { matcher } from '../../combinator';

export function str(pattern: string | RegExp, verify?: (source: string, position: number, range: number) => boolean): StrParser;
export function str(pattern: string | RegExp, verify?: (source: string, position: number, range: number) => boolean): Parser<string> {
  return matcher(pattern, true, verify);
}

export function strs(pattern: string, limit?: number): StrParser;
export function strs(pattern: string, limit: number = -1): Parser<string> {
  assert(pattern);
  return ({ context }) => {
    const { source } = context;
    let acc = '';
    for (let i = 0; i !== limit && context.position < source.length && source.startsWith(pattern, context.position); ++i) {
      acc += pattern;
      context.position += pattern.length;
    }
    return acc
      ? new List([new Node(acc)])
      : undefined;
  };
}
