import { OListParser } from '../block';
import { combine, inits, some, surround, indent, transform, trim } from '../../combinator';
import { block } from '../source/block';
import { line } from '../source/line';
import { ulist } from './ulist';
import { inline } from '../inline';
import { compress } from '../util';
import { html } from 'typed-dom';

const syntax = /^([0-9]+|[A-Z]+|[a-z]+)\.(?=\s|$)/;
const closer = /^(?:\\?\n)?$/;

export const olist: OListParser = block(source => {
  const [, index = ''] = source.match(syntax) || [];
  if (!index) return;
  return transform(
    some(transform(
      inits<OListParser>([
        line(surround(new RegExp(`^${pattern(index)}(?:\.[^\\S\\n]+|\.?(?=\\n|$))`), compress(trim(some(inline, closer))), closer), true, true),
        indent(combine([ulist, olist_]))
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
