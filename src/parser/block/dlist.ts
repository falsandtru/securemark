import { DListParser } from '../block';
import { union, inits, some, block, line, validate, rewrite, context, creator, open, trim, lazy, fmap } from '../../combinator';
import { inline } from '../inline';
import { indexer } from '../inline/extension/indexer';
import { indexee } from '../inline/extension/indexee';
import { anyline } from '../source';
import { localize } from '../locale';
import { visualize } from '../util';
import { html, defrag } from 'typed-dom';
import { push } from 'spica/array';

export const dlist: DListParser = lazy(() => block(localize(fmap(validate(
  /^~[^\S\n]+(?=\S)/,
  some(inits([
    context({ syntax: { inline: {
      label: false,
      media: false,
    }}},
    some(term)),
    some(desc),
  ]))),
  es => [html('dl', fillTrailingDescription(es))]))));

const term: DListParser.TermParser = creator(line(indexee(fmap(open(
  /^~[^\S\n]+(?=\S)/,
  visualize(trim(some(union([indexer, inline])))),
  true),
  ns => [html('dt', defrag(ns))]))));

const desc: DListParser.DescriptionParser = creator(block(fmap(open(
  /^:[^\S\n]+(?=\S)|/,
  rewrite(
    some(anyline, /^[~:][^\S\n]+\S/),
    visualize(trim(some(union([inline]))))),
  true),
  ns => [html('dd', defrag(ns))]),
  false));

function fillTrailingDescription(es: HTMLElement[]): HTMLElement[] {
  return es.length > 0 && es[es.length - 1].tagName === 'DT'
    ? push(es, [html('dd')])
    : es;
}
