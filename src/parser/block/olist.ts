import { OListParser, ListItemParser } from '../block';
import { union, inits, some, fmap, match, surround, verify, block, line, indent, focus, trim } from '../../combinator';
import { contentline } from '../source/line';
import { ulist, fillFirstLine } from './ulist';
import { ilist } from './ilist';
import { inline } from '../inline';
import { compress, hasMedia } from '../util';
import { memoize } from 'spica/memoization';
import { html, frag } from 'typed-dom';

const opener = memoize<string, RegExp>(pattern => new RegExp(`^${pattern}(?:\\.\\s|\\.?(?=\\n|$))`));

export const olist: OListParser = block(match(
  /^([0-9]+|[a-z]+|[A-Z]+)\.(?=\s|$)/,
  ([whole, index], rest) =>
    fmap<OListParser>(
      some(union([
        fmap(
          inits<ListItemParser>([
            line(focus(contentline, verify(surround(opener(pattern(type(index))), compress(trim(some(inline))), '', false), rs => !hasMedia(frag(rs))))),
            indent(union([ulist, olist_, ilist]))
          ]),
          ns => [html('li', fillFirstLine(ns))])
      ])),
      es => [html('ol', { start: index, type: type(index) }, es)])
      (whole + rest)));

function type(index: string): string {
  return Number.isInteger(+index)
    ? '1'
    : index === index.toLowerCase()
      ? 'a'
      : 'A';
}

function pattern(type: string): string {
  assert(['1', 'a', 'A'].includes(type));
  return type === 'A'
    ? '[A-Z]+'
    : type === 'a'
      ? '[a-z]+'
      : '[0-9]+';
}

export const olist_: OListParser = (source: string) =>
  olist(source.replace(/^(?:[0-9]+|[A-Z]+|[a-z]+)(?=\n|$)/, `$&.`));
