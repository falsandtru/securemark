import { Context } from '../context';
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
  const context = new Context({ source });
  const result = h(context);
  const el = result?.head?.value;
  return el?.tagName === 'ASIDE'
    ? [el, context.position]
    : [];
}
