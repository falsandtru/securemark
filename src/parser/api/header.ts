// Must ensure that the next line is blank.
export const syntax = /^---[^\S\v\f\r\n]*\r?\n(?:[A-Za-z][0-9A-Za-z]*(?:-[A-Za-z][0-9A-Za-z]*)*:[ \t]+\S[^\v\f\r\n]*\r?\n){1,100}---[^\S\v\f\r\n]*(?:$|\r?\n(?:[^\S\v\f\r\n]*(?:$|\r?\n)))/;

export function header(source: string): string {
  return source.match(syntax)?.[0] || '';
}

export function headers(source: string): string[] {
  return header(source).trimEnd().split('\n').slice(1, -1);
}
