import { Parser, Context } from '../../data/parser';
import { min } from 'spica/alias';

export function creation<P extends Parser>(cost: number, parser: P): P;
export function creation(cost: number, parser: Parser): Parser {
  assert(cost >= 0);
  return input => {
    const context = input;
    const result = parser(input);
    if (result === undefined) return;
    spend(context, cost);
    return result;
  };
}
export function spend(context: Context, cost: number): void {
  const resources = context.resources ?? { clock: cost || 1, recursions: [1] };
  if (resources.clock < cost) throw new Error('Too many creations');
  resources.clock -= cost;
}

export function recursion<P extends Parser>(index: number, parser: P): P;
export function recursion(index: number, parser: Parser): Parser {
  assert(index >= 0);
  return input => {
    const context = input;
    const resources = context.resources ?? { clock: 1, recursions: [1] };
    const { recursions } = resources;
    recur(recursions, index, 1);
    const result = parser(input);
    recur(recursions, index, -1);
    return result;
  };
}
export function recur(recursions: number[], index: number, size: number, force: boolean = false): void {
  index = min(index, recursions.length && recursions.length - 1);
  if (recursions[index] < size - +force) throw new Error('Too much recursion');
  recursions[index] -= size;
}

export function precedence<P extends Parser>(precedence: number, parser: P): P;
export function precedence<N>(precedence: number, parser: Parser<N>): Parser<N> {
  assert(precedence >= 0);
  return input => {
    const context = input;
    const { delimiters, precedence: p } = context;
    const shift = delimiters && precedence > p;
    context.precedence = precedence;
    // デリミタはシフト後に設定しなければならない
    shift && delimiters.shift(precedence);
    const result = parser(input);
    shift && delimiters.unshift();
    context.precedence = p;
    return result;
  };
}

export function state<P extends Parser>(state: number, parser: P): P;
export function state<P extends Parser>(state: number, positive: boolean, parser: P): P;
export function state<N>(state: number, positive: boolean | Parser<N>, parser?: Parser<N>): Parser<N> {
  if (typeof positive === 'function') {
    parser = positive;
    positive = true;
  }
  assert(state);
  assert(parser = parser!);
  return input => {
    const context = input;
    const s = context.state ?? 0;
    context.state = positive
      ? s | state
      : s & ~state;
    const result = parser(input);
    context.state = s;
    return result;
  };
}

export function constraint<P extends Parser>(state: number, parser: P): P;
//export function constraint<P extends Parser>(state: number, positive: boolean, parser: P): P;
export function constraint<N>(state: number, positive: boolean | Parser<N>, parser?: Parser<N>): Parser<N> {
  if (typeof positive === 'function') {
    parser = positive;
    positive = false;
  }
  assert(state);
  assert(parser = parser!);
  return input => {
    const context = input;
    const s = positive
      ? state & context.state
      : state & ~context.state;
    return s === state
      ? parser(input)
      : undefined;
  };
}
