import { input, eval } from '../../combinator/data/parser';
import { header as h } from '../header';

export function header(source: string): string {
  const [, pos = 0] = parse(source);
  return source.slice(0, pos);
}

export function headers(source: string): string[] {
  const [el] = parse(source);
  return el?.textContent!.trimEnd().slice(el.firstChild!.firstChild!.textContent!.length).split('\n') ?? [];
}

function parse(source: string): [HTMLElement, number] | [] {
  const i = input(source, {});
  const result = h(i);
  const [el] = eval(result, []);
  return el?.tagName === 'ASIDE'
    ? [el, i.context.position]
    : [];
}
