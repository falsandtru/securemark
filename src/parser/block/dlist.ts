import { DListParser } from '../block';
import { union, inits, some, block, line, rewrite, verify, surround, trim, lazy, fmap } from '../../combinator';
import { anyline } from '../source/line';
import { inline, indexer, index } from '../inline';
import { defrag, hasMedia } from '../util';
import { concat } from 'spica/concat';
import { html } from 'typed-dom';

export const dlist: DListParser = lazy(() => block(fmap(
  some(inits([
    some(term),
    some(desc),
  ])),
  es => [html('dl', fillTrailingDescription(es))])));

const term: DListParser.TermParser = line(index(verify(fmap(
  surround(
    /^~(?=\s|$)/,
    defrag(trim(some(union([indexer, inline])))),
    '',
    false),
  ns => [html('dt', ns)]),
  ([el]) => !hasMedia(el))));

const desc: DListParser.DescriptionParser = block(fmap(
  surround(
    /^:(?=\s|$)|/,
    rewrite(
      some(anyline, /^[~:](?=\s|$)/),
      defrag(trim(some(union([inline]))))),
    '',
    false),
  ns => [html('dd', ns)]),
  false);

function fillTrailingDescription(es: HTMLElement[]): HTMLElement[] {
  return es.length > 0 && es[es.length - 1].tagName === 'DT'
    ? concat(es, [html('dd')])
    : es;
}
