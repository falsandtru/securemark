import { DListParser } from '../block';
import { union, inits, some, block, line, rewrite, verify, surround, trim, lazy, fmap } from '../../combinator';
import { anyline, contentline } from '../source/line';
import { inline, indexer, defineIndex } from '../inline';
import { defrag, hasMedia } from '../util';
import { concat } from 'spica/concat';
import { html } from 'typed-dom';

export const dlist: DListParser = lazy(() => block(fmap(
  some(inits([
    some(term),
    some(desc)
  ])),
  es => [html('dl', fillTrailingDescription(es))])));

const term: DListParser.TermParser = line(rewrite(contentline, verify(fmap(
  surround(/^~(?=\s|$)/, defrag(trim(some(union([indexer, inline])))), '', false),
  ns => {
    const dt = html('dt', ns);
    void defineIndex(dt);
    return [dt];
  }),
  ([el]) => !hasMedia(el))));

const desc: DListParser.DescriptionParser = block(fmap(
  rewrite(
    surround(/^:(?=\s|$)|/, some(anyline, /^[~:](?=\s|$)/), '', false),
    surround(/^:(?=\s|$)|/, defrag(trim(some(union([inline])))), '', false)),
  ns => [html('dd', ns)]),
  false);

function fillTrailingDescription(es: HTMLElement[]): HTMLElement[] {
  return es.length > 0 && es[es.length - 1].tagName === 'DT'
    ? concat(es, [html('dd')])
    : es;
}
