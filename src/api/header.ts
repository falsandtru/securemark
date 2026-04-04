import { Input } from '../parser/context';
import { Output, run } from '../combinator/parser';
import { header as h } from '../parser/block/header';

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
  const input = new Input({ source });
  const output = new Output<HTMLElement>();
  for (const _ of run(h,input, output));
  assert(output.data.length === 1);
  const el = output.peek().head?.value;
  return el?.tagName === 'ASIDE'
    ? [el, input.position]
    : [];
}
