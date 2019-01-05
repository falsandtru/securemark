import { ExtensionParser } from '../../inline';
import { union, fmap, surround, line, trim, lazy } from '../../../combinator';
import { index as idx } from './index';
import { html, define } from 'typed-dom';

export const indexer: ExtensionParser.IndexerParser = line(lazy(() =>
  fmap<ExtensionParser.IndexerParser>(
    surround(/^\s+(?=\[#)/, trim(union([idx])), /^(?=\s*$)/),
    ([el]) =>
      [html('small', { class: 'indexer', 'data-index': el.getAttribute('href')!.slice(el.hash.indexOf(':') + 1) })])));

export function defineIndex(source: HTMLElement): void {
  void define(source, { id: identifier(index(source)) });
}

export function index(source: Element): string {
  const indexer = source.matches('.indexer')
    ? source
    : source.querySelector('.indexer');
  if (indexer) return indexer.getAttribute('data-index')!;
  const target = source.cloneNode(true);
  void [...target.querySelectorAll('code[data-src], .math[data-src]')]
    .forEach(el =>
      void define(el, el.getAttribute('data-src')!));
  return target.textContent!.trim();
}

function identifier(index: string): string | undefined {
  assert(!index.includes('\n'));
  return index
    ? `index:${index.trim().replace(/\s+/g, '-')}`
    : undefined;
}
