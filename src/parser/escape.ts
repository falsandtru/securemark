const symbols = /^(?:[~:|>`$-+*\s]|[0-9a-z]+\.|!>|#+\s)|[*`$&()\[\]{}]|\\./gim;

export function escape(source: string): string {
  return source.replace(symbols, str => str[0] === '\\' ? str : `\\${str}`);
}
