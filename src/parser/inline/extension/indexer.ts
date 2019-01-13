import { ExtensionParser } from '../../inline';
import { Parser, union, line, surround, trim, lazy, fmap } from '../../../combinator';
import { index as idx } from './index';
import { html, define } from 'typed-dom';

export const indexer: ExtensionParser.IndexerParser = lazy(() => line(fmap(
  surround(
    /^\s+(?=\[#)/,
    trim(union([idx])),
    /^(?=\s*$)/),
  ([el]) =>
    [html('small', { class: 'indexer', 'data-index': el.getAttribute('href')!.slice(el.hash.indexOf(':') + 1) })])));

export function index<P extends Parser<HTMLElement, any>>(parser: P): P;
export function index<T extends HTMLElement, S extends Parser<any, any>[]>(parser: Parser<T, S>): Parser<T, S> {
  return fmap(parser, ([el]) => [define(el, { id: identifier(text(el)) || undefined })]);
}

export function text(source: Element): string {
  //const indexer = source.querySelector(':scope.indexer, :scope > .indexer');
  const indexer = source.matches('.indexer')
    ? source
    : source.querySelector('.indexer');
  if (indexer) return indexer.getAttribute('data-index')!;
  const target = source.cloneNode(true);
  void target.querySelectorAll('code[data-src], .math[data-src]')
    .forEach(el =>
      void define(el, el.getAttribute('data-src')!));
  return target.textContent!.trim();
}

function identifier(index: string): string {
  assert(!index.includes('\n'));
  return index
    ? `index:${index.trim().replace(/\s+/g, '-')}`
    : '';
}
