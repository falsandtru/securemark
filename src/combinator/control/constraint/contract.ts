import { Parser, Input, Ctx, Node, Context, eval, failsafe } from '../../data/parser';
import { matcher } from '../../../combinator';

//export function contract<P extends Parser<unknown>>(patterns: string | RegExp | (string | RegExp)[], parser: P, cond: (nodes: readonly Data<P>[], rest: string) => boolean): P;
//export function contract<N>(patterns: string | RegExp | (string | RegExp)[], parser: Parser<N>, cond: (nodes: readonly N[], rest: string) => boolean): Parser<N> {
//  return verify(validate(patterns, parser), cond);
//}

export function validate<P extends Parser<unknown>>(pattern: string | RegExp, parser: P): P;
export function validate<P extends Parser<unknown>>(cond: ((input: Input<Context<P>>) => boolean), parser: P): P;
export function validate<N>(pattern: string | RegExp | ((input: Input<Ctx>) => boolean), parser: Parser<N>): Parser<N> {
  if (typeof pattern === 'function') return guard(pattern, parser);
  const match = matcher(pattern, false);
  return input => {
    const { context } = input;
    const { source, position } = context;
    if (position === source.length) return;
    if (!match(input)) return;
    return parser(input);
  };
}

function guard<P extends Parser<unknown>>(f: (input: Input<Context<P>>) => boolean, parser: P): P;
function guard<N>(f: (input: Input<Ctx>) => boolean, parser: Parser<N>): Parser<N> {
  return input =>
    f(input)
      ? parser(input)
      : undefined;
}

export function verify<P extends Parser<unknown>>(parser: P, cond: (nodes: readonly Node<P>[], context: Context<P>) => boolean): P;
export function verify<N>(parser: Parser<N>, cond: (nodes: readonly N[], context: Ctx) => boolean): Parser<N> {
  assert(parser);
  return failsafe(input => {
    const { context } = input;
    const { source, position } = context;
    if (position === source.length) return;
    const result = parser(input);
    assert(context.position > position || !result);
    if (result && !cond(eval(result), context)) return;
    return result;
  });
}
