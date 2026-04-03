import { Parser, Result, Input } from '../parser';
import { always } from '../control/state';

export function line<P extends Parser>(parser: P, slice?: boolean): P;
export function line<T>(parser: Parser<T>, slice: boolean = true): Parser<T> {
  assert(parser);
  interface Memory {
    readonly position: number;
  }
  return always<Parser<T, Input<Memory>>>([
    (input, output) => {
      const { source, position } = input;
      if (position === source.length) return Result.skip;
      input.memory = {
        position,
      };
      if (slice) {
        const line = firstline(source, position);
        input.position += line.length;
        input.scope.focus(line);
      }
      return output.context;
    },
    parser,
    (input, output) => {
      if (slice) {
        input.scope.unfocus(output.state, true);
      }
      if (!output.state) return;
      const { source, position, memory } = input;
      if (position === memory.position || position !== source.length && source[position - 1] !== '\n' && isEmptyline(source, position)) {
        input.position = source.indexOf('\n', position) + 1 || source.length;
      }
      return output.state && (input.position === source.length || source[input.position - 1] === '\n')
        ? output.context
        : Result.fail;
    },
  ]);
}

export function firstline(source: string, position: number): string {
  if (position === source.length) return '';
  const i = source.indexOf('\n', position);
  return i === -1
    ? source.slice(position)
    : source.slice(position, i + 1);
}

const emptyline = /[^\S\r\n]*(?:$|\r?\n)/y;
export function isEmptyline(source: string, position: number): boolean {
  emptyline.lastIndex = position;
  return source.length === position
      || source[position] === '\n'
      || emptyline.test(source);
}
