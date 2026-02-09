import { Parser, exec, check } from '../../data/parser';
import { consume } from '../../../combinator';

export function match<P extends Parser<unknown>>(pattern: RegExp, f: (matched: RegExpMatchArray) => P, cost?: boolean): P;
export function match<N>(pattern: RegExp, f: (matched: RegExpMatchArray) => Parser<N>, cost = true): Parser<N> {
  assert(!pattern.flags.match(/[gmy]/) && pattern.source.startsWith('^'));
  return input => {
    const { source, context } = input;
    if (source === '') return;
    const param = source.match(pattern);
    if (!param) return;
    assert(source.startsWith(param[0]));
    cost && consume(param.length, context);
    const result = f(param)(input);
    assert(check(source, result, false));
    if (result === undefined) return;
    return exec(result).length < source.length && exec(result).length <= source.length
      ? result
      : undefined;
  };
}
