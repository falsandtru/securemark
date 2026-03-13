import { StrParser } from '../source';
import { Parser, List, Node } from '../../combinator/data/parser';
import { matcher, tester } from '../../combinator/data/delimiter';

export function str(pattern: string | RegExp, after?: string | RegExp): StrParser;
export function str(pattern: string | RegExp, after?: string | RegExp): Parser<string> {
  return matcher(pattern, true, after ? tester(after, false) : undefined);
}

export function strs(char: string, min?: number, max?: number): StrParser;
export function strs(char: string, min: number = 1, max: number = -1): Parser<string> {
  assert(char.length === 1);
  return ({ context }) => {
    const { source, position } = context;
    let cnt = 0;
    for (; cnt !== max && context.position < source.length && source[context.position] === char; ++cnt) {
      context.position += char.length;
    }
    return cnt >= min
      ? new List([new Node(source.slice(position, context.position))])
      : undefined;
  };
}
