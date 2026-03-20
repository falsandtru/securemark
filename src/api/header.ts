import { Context } from '../parser/context';
import { header as h } from '../parser/header';

export function header(source: string): string {
  const [, pos = 0] = parse(source);
  return source.slice(0, pos);
}

export function headers(source: string): string[] {
  const [el] = parse(source);
  const acc = [];
  for (let field = el?.firstChild?.firstChild; field = field?.nextSibling;) {
    acc.push(field.textContent!);
  }
  return acc;
}

function parse(source: string): [HTMLElement, number] | [] {
  const context = new Context({ source });
  const result = h(context);
  const el = result?.head?.value;
  return el?.tagName === 'ASIDE'
    ? [el, context.position]
    : [];
}
