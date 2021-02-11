import { undefined } from 'spica/global';
import { MarkdownParser } from '../../../../markdown';
import { Parser } from '../../../combinator/data/parser';
import { fmap } from '../../../combinator';
import { define } from 'typed-dom';

export function indexee<P extends Parser<unknown, MarkdownParser.Context>>(parser: P): P;
export function indexee(parser: Parser<HTMLElement, MarkdownParser.Context>): Parser<HTMLElement> {
  return fmap(parser, ([el], _, { id }) => [define(el, { id: id !== '' && identity(el) || undefined })]);
}

export function identity(source: HTMLElement): string {
  return identify(text(source));
}

export function text(source: HTMLElement): string {
  assert(!source.matches('.indexer'));
  assert(source.querySelectorAll('.indexer').length <= 1);
  assert(source.querySelector('.indexer') === source.querySelector(':scope > .indexer'));
  assert(!source.querySelector('.label'));
  const indexer = source.querySelector('.indexer');
  if (indexer) return indexer.getAttribute('data-index')!;
  const target = source.cloneNode(true);
  for (let es = target.querySelectorAll('code[data-src], .math[data-src]'), i = 0, len = es.length; i < len; ++i) {
    define(es[i], es[i].getAttribute('data-src')!);
  }
  for (let es = target.querySelectorAll('.annotation, .reference, rt, rp'), i = 0, len = es.length; i < len; ++i) {
    es[i].remove();
  }
  return target.innerText.trim();
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
