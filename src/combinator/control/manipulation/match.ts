import { Parser, failsafe } from '../../data/parser';
import { consume } from '../../../combinator';

export function match<P extends Parser<unknown>>(pattern: RegExp, f: (matched: RegExpMatchArray) => P, cost?: boolean): P;
export function match<N>(pattern: RegExp, f: (matched: RegExpMatchArray) => Parser<N>, cost = false): Parser<N> {
  assert(!pattern.flags.match(/[gm]/) && pattern.sticky && !pattern.source.startsWith('^'));
  return failsafe(input => {
    const { context } = input;
    const { source, position } = context;
    if (position === source.length) return;
    pattern.lastIndex = position;
    const param = pattern.exec(source);
    if (!param) return;
    assert(source.startsWith(param[0], position));
    cost && consume(param[0].length, context);
    const result = f(param)(input);
    context.position += result && context.position === position ? param[0].length : 0;
    assert(context.position > position || !result);
    return context.position > position
      ? result
      : undefined;
  });
}
