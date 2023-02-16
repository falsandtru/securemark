import { Parser } from '../combinator/data/parser';
import { convert } from '../combinator';

export function format<P extends Parser<HTMLElement | string>>(parser: P): P;
export function format<T extends HTMLElement | string>(parser: Parser<T>): Parser<T> {
  return convert(
    source => source.replace(/(?<=^!?)https?:\/\/(?:[[]|[^\p{C}\p{S}\p{P}\s])\S*(?=[^\S\n]*(?:$|\n))/gm, '{ $& }'),
    parser);
}

export function stringify(nodes: readonly (HTMLElement | string)[]): string {
  let acc = '';
  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i];
    if (typeof node === 'string') {
      assert(!node.includes('\n'));
      acc += node;
    }
    else {
      assert(!node.matches('br') && !node.querySelector('br'));
      // NOTE: Doesn't reflect line breaks.
      acc += node.innerText;
    }
  }
  return acc;
}
