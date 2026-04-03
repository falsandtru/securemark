import { Parser, Result, Input } from '../parser';
import { matcher } from '../delimiter';
import { always } from '../control/state';
import { clear } from './clear';

export function focus<P extends Parser>(scope: string | RegExp, parser: P, slice?: boolean): P;
export function focus<T>(scope: string | RegExp, parser: Parser<T>, slice = true): Parser<T> {
  assert(parser);
  interface Memory {
    readonly position: number;
    readonly range: number;
  }
  const match = matcher(scope, slice);
  return always<Parser<T, Input<Memory>>>([
    (input, output) => {
      const { source, position } = input;
      if (position === source.length) return Result.skip;
      const src = match(input, output) ?? '';
      assert(source.startsWith(src, position));
      if (src === '') {
        input.position = position;
        return Result.skip;
      }
      input.range = src.length;
      if (slice) {
        input.scope.focus(src);
      }
      else {
        input.memory = {
          position,
          range: input.range,
        };
      }
      return output.context;
    },
    parser,
    (input, output) => {
      if (slice) {
        input.scope.unfocus(output.state, true);
      }
      else {
        input.position += output.state && input.position === input.memory.position
          ? input.memory.range
          : 0;
      }
      return output.context;
    },
  ]);
}

export function rewrite<P extends Parser>(scope: Parser<unknown, Parser.Input<P>>, parser: P, slice?: boolean): P;
export function rewrite<T>(scope: Parser, parser: Parser<T>, slice = true): Parser<T> {
  assert(scope);
  assert(parser);
  interface Memory {
    readonly position: number;
    range: number;
    readonly linebreak: number;
  }
  return always<Parser<T, Input<Memory>>>([
    (input, output) => {
      const { source, position, linebreak } = input;
      if (position === source.length) return Result.skip;
      input.memory = {
        position,
        range: 0,
        linebreak,
      };
      return output.context;
    },
    clear(scope),
    (input, output) => {
      const { source, position, memory } = input;
      const range = position - memory.position;
      input.range = memory.range = range;
      input.linebreak = memory.linebreak;
      if (!output.state || range === 0) {
        input.position = memory.position;
        return Result.skip;
      }
      if (slice) {
        input.scope.focus(source.slice(position - range, position));
      }
      else {
        input.position -= range;
      }
      return output.context;
    },
    parser,
    (input, output) => {
      if (slice) {
        input.scope.unfocus(output.state, true);
      }
      else {
        input.position += output.state && input.position === input.memory.position
          ? input.memory.range
          : 0;
      }
      return output.context;
    },
  ]);
}
