import { undefined } from 'spica/global';
import { Parser, eval, exec, check } from '../../data/parser';

export function line<P extends Parser<unknown>>(parser: P, allowTrailingWhitespace?: boolean): P;
export function line<T, D extends Parser<unknown>[]>(parser: Parser<T, D>, allowTrailingWhitespace = true): Parser<T, D> {
  assert(parser);
  return (source, context) => {
    if (source === '') return;
    const fst = firstline(source);
    const result = parser(fst, context);
    assert(check(fst, result));
    if (!result) return;
    //assert(exec(result) === '' || allowTrailingWhitespace && isEmpty(exec(result)));
    return exec(result) === '' || allowTrailingWhitespace && isEmpty(exec(result))
      ? [eval(result), source.slice(fst.length)]
      : undefined;
  };
}

export function firstline(source: string, keepLinebreak = true): string {
  const i = source[0] === '\n' ? 0 : source.indexOf('\n');
  switch (i) {
    case -1:
      return source;
    case 0:
      return keepLinebreak ? '\n' : '';
    default:
      return source.slice(0, keepLinebreak ? i + 1 : i);
  }
}

export function isEmpty(line: string): boolean {
  return line === ''
      || line === '\n'
      || line.trimStart() === '';
}
