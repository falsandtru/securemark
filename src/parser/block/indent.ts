import { firstline } from '../source/line';

const syntax = /^\s*/;

export function indent(source: string): [string, string] | undefined {
  const [indent = ''] = firstline(source).match(syntax) || [];
  if (indent === '') return;
  const lines: string[] = [];
  let rest = source;
  while (true) {
    const line = firstline(rest);
    if (!line.startsWith(indent)) break;
    if (line.slice(indent.length).trim() === '') break;
    void lines.push(line.slice(indent.length));
    rest = rest.slice(line.length + 1);
  }
  return rest.length < source.length
    ? [lines.join('\n'), rest]
    : undefined;
};

const flag = /^(?:[0-9]+|[A-Z]+|[a-z]+)(?=\n|$)/;
export function fillOListFlag(source: string): string {
  return source.replace(flag, `$&.`);
}
