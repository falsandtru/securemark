import { Parser, Output } from '../parser';
import { always } from '../control/state';
import { min } from 'spica/alias';

export function recursion<P extends Parser>(index: number, parser: P): P;
export function recursion<T>(index: number, parser: Parser<T>): Parser<T> {
  assert(index >= 0);
  return always([
    (input, output) => {
      const resources = input.resources ?? { clock: 1, recursions: [1] };
      const { recursions } = resources;
      recur(output, recursions, index, 1);
      return output.context;
    },
    parser,
    (input, output) => {
      const resources = input.resources ?? { clock: 1, recursions: [1] };
      const { recursions } = resources;
      recur(output, recursions, index, -1);
      return output.context;
    },
  ]);
}
export function recur(output: Output<unknown>, recursions: number[], index: number, size: number, force: boolean = false): void {
  index = min(index, recursions.length && recursions.length - 1);
  if (recursions[index] < size - +force) {
    output.error ??= new Error('Too much recursion');
  }
  recursions[index] -= size;
}
