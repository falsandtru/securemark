import { Parser, input } from '../../data/parser';

export function line<P extends Parser>(parser: P): P;
export function line<N>(parser: Parser<N>): Parser<N> {
  assert(parser);
  return context => {
    const { source, position } = context;
    if (position === source.length) return;
    const line = firstline(source, position);
    context.offset += position;
    const result = parser(input(line, context));
    context.source = source;
    context.position = result
      ? context.position === 0
        ? position + line.length
        : position + context.position
      : position;
    context.offset -= position;
    if (result === undefined ||
        context.position < position + line.length && !isEmptyline(source, context.position)) {
      context.position = position;
      return;
    }
    context.position = position + line.length;
    return result;
  };
}

export function firstline(source: string, position: number): string {
  const i = source.indexOf('\n', position);
  return i === -1
    ? source.slice(position)
    : source.slice(position, i + 1);
}

const emptyline = /[^\S\r\n]*(?:$|\r?\n)/y;
export function isEmptyline(source: string, position: number): boolean {
  emptyline.lastIndex = position;
  return source.length === position
      || source[position] === '\n'
      || emptyline.test(source);
}
