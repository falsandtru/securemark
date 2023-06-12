import { Parser, eval, exec, check } from '../../data/parser';

export function line<P extends Parser<unknown>>(parser: P): P;
export function line<T>(parser: Parser<T>): Parser<T> {
  assert(parser);
  return ({ source, context }) => {
    if (source === '') return;
    const line = firstline(source);
    context.offset ??= 0;
    context.offset += source.length - line.length;
    const result = parser({ source: line, context });
    assert(check(line, result));
    context.offset -= source.length - line.length;
    if (result === undefined) return;
    return isBlank(exec(result))
      ? [eval(result), source.slice(line.length)]
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

export function isBlank(line: string): boolean {
  return line === ''
      || line === '\n'
      || line.trimStart() === '';
}
