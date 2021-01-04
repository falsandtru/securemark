import { DListParser } from '../block';
import { union, inits, some, block, line, validate, rewrite, context, creator, open, convert, trim, lazy, fmap } from '../../combinator';
import { defrag } from '../util';
import { blankline } from './paragraph';
import { inline, indexer, indexee } from '../inline';
import { anyline } from '../source';
import { push } from 'spica/array';
import { html } from 'typed-dom';

export const dlist: DListParser = lazy(() => block(fmap(validate(
  /^~[^\S\n]/,
  convert(source => source.replace(blankline, ''),
  context({ syntax: { inline: { media: false } } },
  some(inits([
    context({ syntax: { inline: {
      label: false,
    }}},
    some(term)),
    some(desc),
  ]))))),
  es => [html('dl', fillTrailingDescription(es))])));

const term: DListParser.TermParser = creator(line(indexee(fmap(
  open(
    /^~[^\S\n]/,
    trim(some(union([indexer, inline]))),
    true),
  ns => [html('dt', defrag(ns))]))));

const desc: DListParser.DescriptionParser = creator(block(fmap(
  open(
    /^:[^\S\n]|/,
    rewrite(
      some(anyline, /^[~:][^\S\n]/),
      trim(some(union([inline])))),
    true),
  ns => [html('dd', defrag(ns))]),
  false));

function fillTrailingDescription(es: HTMLElement[]): HTMLElement[] {
  return es.length > 0 && es[es.length - 1].tagName === 'DT'
    ? push(es, [html('dd')])
    : es;
}
