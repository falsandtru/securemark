import { Parser, Result, Input } from '../parser';
import { always } from '../control/state';
import { spend } from '../effect/clock';

export function match<P extends Parser>(pattern: RegExp, f: (matched: RegExpMatchArray) => P): P;
export function match<T>(pattern: RegExp, f: (matched: RegExpMatchArray) => Parser<T>): Parser<T> {
  assert(!pattern.flags.match(/[gm]/) && pattern.sticky && !pattern.source.startsWith('^'));
  interface Memory {
    readonly position: number;
    readonly range: number;
  }
  return always<Parser<T, Input<Memory>>>([
    (input, output) => {
      const { source, position } = input;
      if (position === source.length) return Result.skip;
      pattern.lastIndex = position;
      const params = pattern.exec(source);
      if (!params) return Result.skip;
      assert(source.startsWith(params[0], position));
      spend(input, output, params[0].length);
      input.memory = {
        position,
        range: params[0].length,
      };
      return f(params)(input, output);
    },
    (input, output) => {
      const { position, memory } = input;
      input.position += output.state
        ? position === memory.position
          ? memory.range
          : 0
        : position - memory.position;
      return output.context;
    },
  ]);
}
