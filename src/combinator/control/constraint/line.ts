import { Parser, input, eval, exec, check, failsafe } from '../../data/parser';

export function line<P extends Parser<unknown>>(parser: P): P;
export function line<N>(parser: Parser<N>): Parser<N> {
  assert(parser);
  return failsafe(({ source, context }) => {
    if (source === '') return;
    const line = firstline(source);
    context.offset ??= 0;
    context.offset += source.length - line.length;
    const result = parser(input(line, context));
    assert(check(line, result));
    context.offset -= source.length - line.length;
    if (result === undefined) return;
    if (!isBlank(exec(result))) return;
    context.position += line.length;
    return [eval(result), source.slice(line.length)];
  });
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
