import { DListParser } from '../block';
import { State } from '../context';
import { union, inits, some, state, block, line, validate, rewrite, open, lazy, fmap } from '../../combinator';
import { inline, indexee, indexer, dataindex } from '../inline';
import { anyline } from '../source';
import { lineable } from '../util';
import { visualize, trimBlank, trimBlankEnd } from '../visibility';
import { push } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

export const dlist: DListParser = lazy(() => block(fmap(validate(
  /^~[^\S\n]+(?=\S)/,
  some(inits([
    state(State.annotation | State.reference | State.index | State.label | State.link,
    some(term)),
    some(desc),
  ]))),
  es => [html('dl', fillTrailingDescription(es))])));

const term: DListParser.TermParser = line(indexee(fmap(open(
  /^~[^\S\n]+(?=\S)/,
  visualize(trimBlank(some(union([indexer, inline])))),
  true),
  ns => [html('dt', { 'data-index': dataindex(ns) }, defrag(ns))])));

const desc: DListParser.DescriptionParser = block(fmap(open(
  /^:[^\S\n]+(?=\S)|/,
  rewrite(
    some(anyline, /^[~:][^\S\n]+\S/),
    visualize(trimBlankEnd(lineable(some(union([inline])))))),
  true),
  ns => [html('dd', defrag(ns))]),
  false);

function fillTrailingDescription(es: HTMLElement[]): HTMLElement[] {
  return es.length > 0 && es.at(-1)!.tagName === 'DT'
    ? push(es, [html('dd')])
    : es;
}
