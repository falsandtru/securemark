import { isArray } from 'spica/alias';
import { Parser, Input, Ctx, Node, Context, eval, failsafe } from '../../data/parser';

//export function contract<P extends Parser<unknown>>(patterns: string | RegExp | (string | RegExp)[], parser: P, cond: (nodes: readonly Data<P>[], rest: string) => boolean): P;
//export function contract<N>(patterns: string | RegExp | (string | RegExp)[], parser: Parser<N>, cond: (nodes: readonly N[], rest: string) => boolean): Parser<N> {
//  return verify(validate(patterns, parser), cond);
//}

export function validate<P extends Parser<unknown>>(patterns: string | RegExp | (string | RegExp)[], parser: P): P;
export function validate<P extends Parser<unknown>>(cond: ((input: Input<Context<P>>) => boolean), parser: P): P;
export function validate<N>(patterns: string | RegExp | (string | RegExp)[] | ((input: Input<Ctx>) => boolean), parser: Parser<N>): Parser<N> {
  if (typeof patterns === 'function') return guard(patterns, parser);
  if (!isArray(patterns)) return validate([patterns], parser);
  assert(patterns.length > 0);
  assert(patterns.every(pattern => pattern instanceof RegExp ? !pattern.flags.match(/[gmy]/) && pattern.source.startsWith('^') : true));
  const match: (context: Ctx) => boolean = global.eval([
    '({ source, position }) =>',
    patterns.map(pattern =>
      typeof pattern === 'string'
        ? `|| source.startsWith('${pattern}', position)`
        : `|| /${pattern.source}/${pattern.flags}.test(source.slice(position))`).join('').slice(2),
  ].join(''));
  return input => {
    const { context } = input;
    const { source, position } = context;
    if (position === source.length) return;
    if (!match(context)) return;
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
