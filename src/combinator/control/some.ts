import { Parser, Result, Input } from '../parser';
import { Delimiters } from '../delimiter';
import { always } from './state';

type DelimiterOption = readonly [delimiter: string | RegExp, precedence: number];

export function some<P extends Parser>(parser: P, limit?: number): P;
export function some<P extends Parser>(parser: P, delimiters?: readonly DelimiterOption[], limit?: number): P;
export function some<P extends Parser>(parser: P, delimiter: string | RegExp, delimiters?: readonly DelimiterOption[], limit?: number): P;
export function some<P extends Parser>(parser: P, delimiter: string | RegExp, after: string | RegExp, delimiters?: readonly DelimiterOption[], limit?: number): P;
export function some<T>(parser: Parser<T>, delimiter?: number | string | RegExp | readonly DelimiterOption[], after?: number | string | RegExp | readonly DelimiterOption[], delimiters?: number | readonly DelimiterOption[], limit = 0): Parser<T> {
  if (typeof delimiter === 'number') {
    limit = delimiter;
    delimiters = undefined;
    delimiter = undefined;
  }
  else if (Array.isArray(delimiter)) {
    limit = after as number;
    delimiters = delimiter;
    delimiter = undefined;
  }
  else if (after === undefined || Array.isArray(after)) {
    limit = delimiters as number;
    delimiters = after;
    after = undefined;
  }
  else {
    delimiters = delimiters as readonly DelimiterOption[];
  }
  assert(parser);
  assert(delimiter !== '');
  assert(delimiters === undefined || Array.isArray(delimiters));
  const test = Delimiters.tester(delimiter as string, after as string);
  const delims = delimiters?.map(([delimiter, precedence]) => ({
    signature: Delimiters.signature(delimiter),
    tester: Delimiters.tester(delimiter),
    precedence,
  }));
  interface Memory {
    readonly position: number;
  }
  // 末尾再帰
  const loop: Result<T, Input<Memory>> = [
    (input, output) =>
      test(input, output) || input.delimiters.test(input, output)
        ? Result.skip
        : Result.succ,
    parser,
    (input, output) =>
      output.state
        // 次にパースに成功すれば確実に制限値を超えるので制限値ちょうどでも中止する
        ? input.position === input.source.length || limit !== 0 && input.position - input.memory.position >= limit
          ? Result.succ
          : loop
        : Result.fail,
  ];
  return always<Parser<T, Input<Memory>>>([
    input => {
      const { source, position } = input;
      if (position === source.length) return Result.skip;
      input.memory = {
        position,
      };
      delims && input.delimiters.push(delims);
      return loop;
    },
    input => {
      delims && input.delimiters.pop(delims.length);
      return input.position > input.memory.position
        ? Result.succ
        : Result.fail;
    },
  ]);
}
