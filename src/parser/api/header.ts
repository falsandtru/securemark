import { input, eval, exec } from '../../combinator/data/parser';
import { header as h } from '../header';

export function header(source: string): string {
  const [, rest = source] = parse(source);
  return source.slice(0, source.length - rest.length);
}

export function headers(source: string): string[] {
  const [el] = parse(source);
  return el?.textContent!.trimEnd().slice(el.firstChild!.firstChild!.textContent!.length).split('\n') ?? [];
}

function parse(source: string): [HTMLElement, string] | [] {
  const result = h(input(source, {}));
  const [el] = eval(result, []);
  return el?.tagName === 'ASIDE'
    ? [el, exec(result!)]
    : [];
}
