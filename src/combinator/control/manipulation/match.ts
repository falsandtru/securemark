import { undefined } from 'spica/global';
import { Parser, exec, check } from '../../data/parser';

export function match<P extends Parser<unknown>>(pattern: RegExp, f: (matched: RegExpMatchArray) => P): P;
export function match<T>(pattern: RegExp, f: (matched: RegExpMatchArray) => Parser<T>): Parser<T> {
  assert(!pattern.flags.match(/[gmy]/) && pattern.source.startsWith('^'));
  return input => {
    const { source } = input;
    if (source === '') return;
    const param = source.match(pattern);
    if (!param) return;
    assert(source.startsWith(param[0]));
    const result = f(param)(input);
    assert(check(source, result, false));
    if (!result) return;
    return exec(result).length < source.length && exec(result).length <= source.length
      ? result
      : undefined;
  };
}
