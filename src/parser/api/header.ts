import { eval, exec } from '../../combinator/data/parser';
import { header as h } from '../header';

export function header(source: string): string {
  const [, rest = source] = parse(source);
  return source.slice(0, source.length - rest.length);
}

export function headers(source: string): string[] {
  const [el] = parse(source);
  return el?.textContent!.trimEnd().slice(el.firstChild!.textContent!.length).split('\n') ?? [];
}

function parse(source: string): [HTMLDetailsElement, string] | [] {
  const result = h(source, {});
  const [el] = eval(result, []);
  return el instanceof HTMLDetailsElement
    ? [el, exec(result!)]
    : [];
}
