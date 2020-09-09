import { undefined } from 'spica/global';
import { Parser, fmap } from '../../../combinator';
import { define } from 'typed-dom';

export function indexee<P extends Parser<unknown>>(parser: P): P;
export function indexee(parser: Parser<HTMLElement>): Parser<HTMLElement> {
  return fmap(parser, ([el]) => [define(el, { id: identity(text(el)) || undefined })]);
}

export function text(source: HTMLElement): string {
  assert(!source.matches('.indexer'));
  assert(source.querySelectorAll('.indexer').length < 2);
  assert(source.querySelector('.indexer') === source.querySelector(':scope > .indexer'));
  const indexer = source.querySelector(':scope > .indexer');
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

function identity(index: string): string {
  assert(!index.includes('\n'));
  return index
    ? `index:${index.trim().replace(/\s+/g, '_').slice(0, 101).replace(/^(.{97}).{4}$/, '$1...')}`
    : '';
}
assert(identity('0'.repeat(100)).slice(6) === '0'.repeat(100));
assert(identity('0'.repeat(101)).slice(6) === '0'.repeat(97) + '...');
assert(identity('0'.repeat(200)).slice(6) === '0'.repeat(97) + '...');
