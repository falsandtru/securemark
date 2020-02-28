import { DListParser } from '../block';
import { union, inits, some, block, line, validate, rewrite, open, convert, trim, context, lazy, fmap } from '../../combinator';
import { defrag } from '../util';
import { anyline } from '../source';
import { inline, indexer, indexee } from '../inline';
import { blankline } from './paragraph';
import { html } from 'typed-dom';
import { push } from 'spica/array';

export const dlist: DListParser = lazy(() => block(fmap(validate(
  /^~(?=$|\s)/,
  convert(source => source.replace(blankline, ''),
  context({ syntax: { inline: { media: false } } },
  some(inits([
    some(term),
    some(desc),
  ]))))),
  es => [html('dl', fillTrailingDescription(es))])));

const term: DListParser.TermParser = line(indexee(fmap(
  open(
    /^~(?=$|\s)/,
    trim(some(union([indexer, inline]))),
    true),
  ns => [html('dt', defrag(ns))])));

const desc: DListParser.DescriptionParser = block(fmap(
  open(
    /^:(?=$|\s)|/,
    rewrite(
      some(anyline, /^[~:](?=$|\s)/),
      trim(some(union([inline])))),
    true),
  ns => [html('dd', defrag(ns))]),
  false);

function fillTrailingDescription(es: HTMLElement[]): HTMLElement[] {
  return es.length > 0 && es[es.length - 1].tagName === 'DT'
    ? push(es, [html('dd')])
    : es;
}
