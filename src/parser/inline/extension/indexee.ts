import { undefined } from 'spica/global';
import { MarkdownParser } from '../../../../markdown';
import { Parser } from '../../../combinator/data/parser';
import { fmap } from '../../../combinator';
import { define } from 'typed-dom';

export function indexee<P extends Parser<unknown, MarkdownParser.Context>>(parser: P): P;
export function indexee(parser: Parser<HTMLElement, MarkdownParser.Context>): Parser<HTMLElement> {
  return fmap(parser, ([el], _, { id }) => [define(el, { id: id !== '' && identity(el) || undefined })]);
}

export function identity(source: HTMLElement | DocumentFragment): string {
  return identify(text(source).trim());
}

export function text(source: HTMLElement | DocumentFragment): string {
  assert(source instanceof DocumentFragment || !source.matches('.indexer'));
  assert(source.querySelectorAll('.indexer').length <= 1);
  assert(source.querySelector('.indexer') === source.querySelector(':scope > .indexer'));
  assert(!source.querySelector('.annotation, br'));
  const indexer = source.querySelector('.indexer');
  if (indexer) return indexer.getAttribute('data-index')!;
  const target = source.cloneNode(true) as typeof source;
  for (
    let es = target.querySelectorAll('code[data-src], .math[data-src], rt, rp, .reference'),
        i = 0, len = es.length; i < len; ++i) {
    const el = es[i];
    switch (el.tagName) {
      case 'RT':
      case 'RP':
        el.remove();
        continue;
      case 'SUP':
        el.firstChild!.remove();
        el.matches('.reference + .reference') && el.prepend(' ');
        continue;
      default:
        define(el, el.getAttribute('data-src')!);
        continue;
    }
  }
  // Better:
  //return target.innerText;
  return target.textContent!;
}

export function identify(index: string): string {
  assert(!index.includes('\n'));
  assert(index === index.trim());
  return index
    ? `index:${index.replace(/\s+/g, '_').slice(0, 101).replace(/^(.{97}).{4}$/, '$1...')}`
    : '';
}
assert(identify('0'.repeat(100)).slice(6) === '0'.repeat(100));
assert(identify('0'.repeat(101)).slice(6) === '0'.repeat(97) + '...');
assert(identify('0'.repeat(200)).slice(6) === '0'.repeat(97) + '...');
