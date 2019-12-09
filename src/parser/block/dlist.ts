import { DListParser } from '../block';
import { union, inits, some, block, line, validate, rewrite, surround, convert, trim, configure, lazy, fmap } from '../../combinator';
import { anyline } from '../source';
import { inline, indexer, indexee } from '../inline';
import { blankline } from './paragraph';
import { defrag } from '../util';
import { concat } from 'spica/concat';
import { html } from 'typed-dom';

export const dlist: DListParser = lazy(() => block(fmap(validate(
  /^~(?=\s|$)/,
  configure({ syntax: { inline: { media: false } } },
  convert(source => source.replace(blankline, ''),
  some(inits([
    some(term),
    some(desc),
  ]))))),
  es => [html('dl', fillTrailingDescription(es))])));

const term: DListParser.TermParser = line(indexee(fmap(
  surround(
    /^~(?=\s|$)/,
    defrag(trim(some(union([indexer, inline])))),
    '',
    false),
  ns => [html('dt', ns)])));

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
