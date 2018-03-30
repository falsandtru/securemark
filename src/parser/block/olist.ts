import { OListParser } from '../block';
import { union, inits, some, surround, indent, transform, trim } from '../../combinator';
import { block } from '../source/block';
import { line } from '../source/line';
import { ulist } from './ulist';
import { inline } from '../inline';
import { compress } from '../util';
import { html } from 'typed-dom';

const syntax = /^([0-9]+|[A-Z]+|[a-z]+)\.(?=\s|$)/;
const closer = /^(?:\\?\n)?$/;
const cache = new Map<string, RegExp>();

export const olist: OListParser = block(source => {
  const [, index = ''] = source.match(syntax) || [];
  if (!index) return;
  const opener = cache.has(index)
    ? cache.get(index)!
    : cache.set(index, new RegExp(`^${pattern(index)}(?:\.[^\\S\\n]+|\.?(?=\\n|$))`)).get(index)!;
  return transform(
    some(transform(
      inits<OListParser>([
        line(surround(opener, compress(trim(some(inline, closer))), closer), true, true),
        indent(union([ulist, olist_]))
      ]),
      (ns, rest) =>
        ns.length === 1 && [HTMLUListElement, HTMLOListElement].some(C => ns[0] instanceof C)
          ? undefined
          : [[html('li', ns)], rest])),
    (es, rest) =>
      [[html('ol', { start: index, type: type(index) }, es)], rest])
    (source);
});

function type(index: string): string {
  return Number.isFinite(+index)
    ? '1'
    : index === index.toLowerCase()
      ? 'a'
      : 'A';
}

function pattern(index: string): string {
  index = type(index);
  return index === 'A'
    ? '[A-Z]+'
    : index === 'a'
      ? '[a-z]+'
      : '[0-9]+';
}

export const olist_: OListParser = (source: string) =>
  olist(source.replace(/^(?:[0-9]+|[A-Z]+|[a-z]+)(?=\n|$)/, `$&.`));
