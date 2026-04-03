import { Parser, Input } from '../parser';
import { Delimiters } from '../delimiter';
import { always } from '../control/state';

export class Precedence {
  constructor(input: Input) {
    this.delimiters = input.delimiters;
  }
  private readonly stack: number[] = [];
  private readonly delimiters: Delimiters;
  public get(): number {
    return this.stack.at(-1) ?? 0;
  }
  public modify(precedence: number): void {
    const p = this.get();
    this.stack.push(precedence);
    precedence > p && this.delimiters.shift(precedence);
  }
  public revert(precedence: number): void {
    assert(this.stack.length > 0);
    const p = this.stack.pop()!;
    precedence > p && this.delimiters.unshift();
  }
}

export function precedence<P extends Parser>(precedence: number, parser: P): P;
export function precedence<T>(precedence: number, parser: Parser<T>): Parser<T> {
  assert(precedence >= 0);
  interface Memory {
    readonly precedence: number;
  }
  return always<Parser<T, Input<Memory>>>([
    (input, output) => {
      const p = input.precedence;
      precedence > p && input.delimiters.shift(precedence);
      input.memory = {
        precedence: p,
      };
      input.precedence = precedence;
      return output.context;
    },
    parser,
    (input, output) => {
      const p = input.memory.precedence;
      input.precedence = p;
      precedence > p && input.delimiters.unshift();
      return output.context;
    },
  ]);
}
