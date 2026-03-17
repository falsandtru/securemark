import { Parser, failsafe } from '../../data/parser';
import { consume } from '../../../combinator';

export function match<P extends Parser>(pattern: RegExp, f: (matched: RegExpMatchArray) => P): P;
export function match<N>(pattern: RegExp, f: (matched: RegExpMatchArray) => Parser<N>): Parser<N> {
  assert(!pattern.flags.match(/[gm]/) && pattern.sticky && !pattern.source.startsWith('^'));
  const count = typeof pattern === 'object'
    ? /[^^\\*+][*+]|{\d+,}/.test(pattern.source)
    : false;
  return failsafe(input => {
    const context = input;
    const { source, position } = context;
    if (position === source.length) return;
    pattern.lastIndex = position;
    const params = pattern.exec(source);
    if (!params) return;
    assert(source.startsWith(params[0], position));
    count && consume(params[0].length, context);
    const result = f(params)(input);
    context.position += result && context.position === position ? params[0].length : 0;
    return result;
  });
}
