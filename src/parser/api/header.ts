import { eval, exec } from '../../combinator';
import { header as h } from '../header';

export function header(source: string): string {
  return source.slice(0, source.length - exec(h(source, {}), source).length);
}

export function headers(source: string): string[] {
  const [el] = eval(h(source, {}), []);
  return el && el.childNodes.length > 1
    ? el.lastChild!.textContent!.split(/[^\S\n]*\n/)
    : [];
}
