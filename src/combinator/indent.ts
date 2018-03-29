import { Parser } from './parser';

const syntax = /^\s*/;

export function indent<P extends Parser<any, any>>(parser: P): P;
export function indent<T, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  assert(parser);
  return source => {
    const [indent = ''] = firstline(source).match(syntax) || [];
    if (indent === '') return;
    const lines: string[] = [];
    let rest = source;
    while (true) {
      const line = firstline(rest);
      if (!line.startsWith(indent)) break;
      const content = line.slice(indent.length);
      if (content.trim() === '') break;
      void lines.push(content);
      rest = rest.slice(line.length + 1);
    }
    if (lines.length === 0) return;
    const [rs = [], r = undefined] = parser(lines.join('\n')) || [];
    return rest.length < source.length && r === ''
      ? [rs, rest]
      : undefined;
  };
}

function firstline(source: string): string {
  const i = source.indexOf('\n');
  return i === -1
    ? source
    : source.slice(0, i);
}
