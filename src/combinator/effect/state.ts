import { Parser, Result, Input } from '../parser';
import { always } from '../control/state';

export class State<T> {
  constructor(private readonly initial: T) {
  }
  private readonly stack: T[] = [];
  public get(): T {
    return this.stack.at(-1) ?? this.initial;
  }
  public put(state: T): void {
    this.stack.push(state);
  }
  public delete(): T {
    assert(this.stack.length > 0);
    const state = this.stack.pop()!;
    return state;
  }
}

export function state<P extends Parser>(state: number, parser: P): P;
export function state<P extends Parser>(state: number, positive: boolean, parser: P): P;
export function state<T>(state: number, positive: boolean | Parser<T>, parser?: Parser<T>): Parser<T> {
  if (typeof positive === 'function') {
    parser = positive;
    positive = true;
  }
  assert(state);
  assert(parser = parser!);
  interface Memory {
    readonly state: number;
  }
  return always<Parser<T, Input<Memory>>>([
    (input, output) => {
      const s = input.state;
      input.state = positive
        ? s | state
        : s & ~state;
      input.memory = {
        state: s,
      };
      return output.context;
    },
    parser,
    (input, output) => {
      input.state = input.memory.state;
      return output.context;
    },
  ]);
}

export function constraint<P extends Parser>(state: number, parser: P): P;
//export function constraint<P extends Parser>(state: number, positive: boolean, parser: P): P;
export function constraint<T>(state: number, positive: boolean | Parser<T>, parser?: Parser<T>): Parser<T> {
  if (typeof positive === 'function') {
    parser = positive;
    positive = false;
  }
  assert(state);
  assert(parser = parser!);
  return always([
    (input, output) => {
      const s = positive
        ? state & input.state
        : state & ~input.state;
      return s === state
        ? output.context
        : Result.skip;
    },
    parser,
  ]);
}
