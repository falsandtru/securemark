import { Parser } from '../../data/parser';
import { spend } from '../../../combinator';

export function match<P extends Parser>(pattern: RegExp, f: (matched: RegExpMatchArray) => P): P;
export function match<N>(pattern: RegExp, f: (matched: RegExpMatchArray) => Parser<N>): Parser<N> {
  assert(!pattern.flags.match(/[gm]/) && pattern.sticky && !pattern.source.startsWith('^'));
  const count = typeof pattern === 'object'
    ? /[^^\\*+][*+]|{\d+,}/.test(pattern.source)
    : false;
  return input => {
    const context = input;
    const { source, position } = context;
    if (position === source.length) return;
    pattern.lastIndex = position;
    const params = pattern.exec(source);
    if (!params) return;
    assert(source.startsWith(params[0], position));
    count && spend(context, params[0].length);
    const result = f(params)(input);
    context.position += result
      ? context.position === position
        ? params[0].length
        : 0
      : context.position - position;
    return result;
  };
}
