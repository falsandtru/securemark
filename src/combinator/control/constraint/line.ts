import { undefined } from 'spica/global';
import { Parser, eval, exec, check } from '../../data/parser';

export function line<P extends Parser<unknown>>(parser: P, allowTrailingWhitespace?: boolean): P;
export function line<T>(parser: Parser<T>, allowTrailingWhitespace = true): Parser<T> {
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

export function firstline(source: string): string {
  const i = source.indexOf('\n');
  switch (i) {
    case -1:
      return source;
    case 0:
      return '\n';
    default:
      return source.slice(0, i + 1);
  }
}

export function unline(line: string): string {
  return line === ''
      || line[line.length - 1] !== '\n'
    ? line
    : line.slice(0, -1);
}

export function isEmpty(line: string): boolean {
  return line === ''
      || line === '\n'
      || line.trimStart() === '';
}
