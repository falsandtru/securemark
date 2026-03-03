import { DListParser } from '../block';
import { State } from '../context';
import { List, Data } from '../../combinator/data/parser';
import { union, inits, some, state, block, line, validate, rewrite, open, lazy, fmap } from '../../combinator';
import { inline, indexee, indexer, dataindex } from '../inline';
import { anyline } from '../source';
import { visualize, trimBlank, trimBlankEnd } from '../visibility';
import { unwrap } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const dlist: DListParser = lazy(() => block(fmap(validate(
  /~ +(?=\S)/y,
  some(inits([
    state(State.annotation | State.reference | State.index | State.label | State.link,
    some(term)),
    some(desc),
  ]))),
  ns => new List([new Data(html('dl', unwrap(fillTrailingDescription(ns))))]))));

const term: DListParser.TermParser = line(indexee(fmap(open(
  /~ +(?=\S)/y,
  visualize(trimBlank(some(union([indexer, inline])))),
  true),
  ns => new List([new Data(html('dt', { 'data-index': dataindex(ns) }, defrag(unwrap(ns))))]))));

const desc: DListParser.DescriptionParser = block(fmap(open(
  /: +(?=\S)|/y,
  rewrite(
    some(anyline, /[~:] +(?=\S)/y),
    visualize(trimBlankEnd(some(union([inline]))))),
  true),
  ns => new List([new Data(html('dd', defrag(unwrap(ns))))])),
  false);

function fillTrailingDescription(nodes: List<Data<HTMLElement>>): List<Data<HTMLElement>> {
  return nodes.last?.value.tagName === 'DT'
    ? nodes.push(new Data(html('dd'))) && nodes
    : nodes;
}
