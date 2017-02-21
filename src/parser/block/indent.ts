const syntax = /^([ \t]*)/;

export function indent(source: string): [string, string] {
  const [indent] = source.match(syntax) || [''];
  if (indent === '') return ['', source];
  const lines: string[] = [];
  while (true) {
    const line = source.split('\n', 1)[0];
    if (!line.startsWith(indent)) break;
    void lines.push(line.slice(indent.length));
    source = source.slice(line.length + 1);
  }
  return [lines.join('\n'), source];
};
