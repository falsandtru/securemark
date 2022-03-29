import { undefined } from 'spica/global';
import { Parser, exec, check } from '../../data/parser';

export function match<P extends Parser<unknown>>(pattern: RegExp, f: (matched: RegExpMatchArray) => P): P;
export function match<T>(pattern: RegExp, f: (matched: RegExpMatchArray) => Parser<T>): Parser<T> {
  assert(!pattern.flags.match(/[gmy]/) && pattern.source.startsWith('^'));
  return (source, context) => {
    if (source === '') return;
    const param = source.match(pattern);
    if (!param) return;
    assert(source.startsWith(param[0]));
    const rest = source.slice(param[0].length);
    const result = f(param)(rest, context);
    assert(check(source, result, false));
    if (!result) return;
    return exec(result).length < source.length && exec(result).length <= rest.length
      ? result
      : undefined;
  };
}
