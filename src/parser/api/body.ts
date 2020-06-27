import { header } from './header';

export function body(source: string): string {
  return header(source)
    ? source.replace(/^(?:[^\n]*\n)+?---[^\S\n]*(?:$|\n(?:[^\S\n]*\n?)?)/, '')
    : source;
}
