import { Parser, input, failsafe } from '../../data/parser';

export function line<P extends Parser<unknown>>(parser: P): P;
export function line<N>(parser: Parser<N>): Parser<N> {
  assert(parser);
  return failsafe(({ context }) => {
    const { source, position } = context;
    if (position === source.length) return;
    const line = firstline(source, position);
    context.offset ??= 0;
    context.offset += position;
    const result = parser(input(line, context));
    context.position += position;
    context.position += result && context.position === position ? line.length : 0;
    assert(context.position > position || !result);
    context.source = source;
    context.offset -= position;
    if (result === undefined) return;
    if (context.position < position + line.length && !isBlankline(source, context.position)) return;
    context.position = position + line.length;
    return result;
  });
}

export function firstline(source: string, position: number): string {
  const i = source.indexOf('\n', position);
  return i === -1
    ? source.slice(position)
    : source.slice(position, i + 1);
}

const blankline = /[^\S\n]*(?:$|\n)/y;
export function isBlankline(source: string, position: number): boolean {
  blankline.lastIndex = position;
  return source.length === position
      || source[position] === '\n'
      || blankline.test(source);
}
