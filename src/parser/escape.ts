const symbols = /^[~:|>`$-+*\s]|^#[^\S\n]|^[0-9a-z]+\.|[*`$&()\[\]{}]|\\./gim;

export function escape(source: string): string {
  return source.replace(symbols, str => str[0] === '\\' ? str : `\\${str}`);
}
