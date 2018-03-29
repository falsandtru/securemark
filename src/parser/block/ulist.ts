import { UListParser } from '../block';
import { combine, inits, some, surround, indent, transform, trim } from '../../combinator';
import { block } from '../source/block';
import { line } from '../source/line';
import { olist_ } from './olist';
import { inline } from '../inline';
import { compress } from '../util';
import { html } from 'typed-dom';

const syntax = /^([-+*])(?=\s|$)/;
const closer = /^(?:\\?\n)?$/;

export const ulist: UListParser = block(source => {
  const [, flag = ''] = source.match(syntax) || [];
  if (!flag) return;
  return transform(
    some(transform(
      inits<UListParser>([
        line(surround(new RegExp(`^\\${flag}(?:[^\\S\\n]+|(?=\\n|$))`), compress(trim(some(inline, closer))), closer), true, true),
        indent(combine([ulist, olist_]))
      ]),
      (ns, rest) =>
        ns.length === 1 && [HTMLUListElement, HTMLOListElement].some(C => ns[0] instanceof C)
          ? undefined
          : [[html('li', ns)], rest])),
    (es, rest) =>
      [[html('ul', es)], rest])
    (source);
});
