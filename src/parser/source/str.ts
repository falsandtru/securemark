import { StrParser } from '../source';
import { Parser, Node } from '../../combinator/parser';
import { matcher, tester } from '../../combinator/delimiter';

export function str(pattern: string | RegExp, after?: string | RegExp): StrParser;
export function str(pattern: string | RegExp, after?: string | RegExp): Parser<string> {
  const match = matcher(pattern, true, after ? tester(after, false) : undefined);
  return (input, output) => {
    const src = match(input, output);
    if (src === undefined) return;
    return output.append(new Node(src));
  };
}

export function strs(char: string, min?: number, max?: number): StrParser;
export function strs(char: string, min: number = 1, max: number = -1): Parser<string> {
  assert(char.length === 1);
  return (input, output) => {
    const { source, position } = input;
    let pos = position;
    let cnt = 0;
    for (; cnt !== max && pos < source.length && source[pos] === char;) {
      pos += char.length;
      ++cnt;
    }
    if (cnt < min) return;
    input.position = pos;
    return output.append(new Node(source.slice(position, input.position)));
  };
}
