import { MarkdownParser } from '../../markdown';
import { Parser } from '../combinator/data/parser';
import { memoize } from 'spica/memoize';

export function clean<P extends Parser<unknown>>(parser: P): P;
export function clean<T>(parser: Parser<T, MarkdownParser.Context>): Parser<T, MarkdownParser.Context> {
  const clean = memoize<MarkdownParser.Context, MarkdownParser.Context>(context => ({
    resources: context.resources,
    precedence: context.precedence,
    delimiters: context.delimiters,
    host: context.host,
    url: context.url,
    id: context.id,
    header: context.header,
    cache: context.caches,
  }), new WeakMap());
  return (source, context) =>
    parser(source, context.syntax ? clean(context) : context);
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
