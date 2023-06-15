import { DListParser } from '../block';
import { union, inits, some, creation, state, block, line, validate, rewrite, open, lazy, fmap } from '../../combinator';
import { inline, indexee, indexer } from '../inline';
import { anyline } from '../source';
import { State } from '../context';
import { lineable } from '../util';
import { visualize, trimBlankStart, trimNodeEnd } from '../visibility';
import { push } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

export const dlist: DListParser = lazy(() => block(fmap(validate(
  /^~[^\S\n]+(?=\S)/,
  some(inits([
    state(State.annotation | State.reference | State.index | State.label | State.link | State.media,
    some(term)),
    some(desc),
  ]))),
  es => [html('dl', fillTrailingDescription(es))])));

const term: DListParser.TermParser = creation(1, false, line(indexee(fmap(open(
  /^~[^\S\n]+(?=\S)/,
  visualize(trimBlankStart(some(union([indexer, inline])))),
  true),
  ns => [html('dt', trimNodeEnd(defrag(ns)))]))));

const desc: DListParser.DescriptionParser = creation(1, false, block(fmap(open(
  /^:[^\S\n]+(?=\S)|/,
  rewrite(
    some(anyline, /^[~:][^\S\n]+\S/),
    visualize(lineable(some(union([inline]))))),
  true),
  ns => [html('dd', trimNodeEnd(defrag(ns)))]),
  false));

function fillTrailingDescription(es: HTMLElement[]): HTMLElement[] {
  return es.length > 0 && es[es.length - 1].tagName === 'DT'
    ? push(es, [html('dd')])
    : es;
}
