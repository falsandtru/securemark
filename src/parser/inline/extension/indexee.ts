import { undefined } from 'spica/global';
import { MarkdownParser } from '../../../../markdown';
import { Parser } from '../../../combinator/data/parser';
import { fmap } from '../../../combinator';
import { define } from 'typed-dom';

export function indexee<P extends Parser<unknown, MarkdownParser.Context>>(parser: P, optional?: boolean): P;
export function indexee(parser: Parser<HTMLElement, MarkdownParser.Context>, optional?: boolean): Parser<HTMLElement> {
  return fmap(parser, ([el], _, { id }) => [define(el, { id: id !== '' && identity(text(el, optional)) || undefined })]);
}

export function identity(text: string): string {
  assert(!text.includes('\n'));
  text &&= text.trim();
  return text && `index:${text.replace(/\s+/g, '_').slice(0, 101).replace(/^(.{97}).{4}$/, '$1...')}`;
}
assert(identity('0'.repeat(100)).slice(6) === '0'.repeat(100));
assert(identity('0'.repeat(101)).slice(6) === '0'.repeat(97) + '...');
assert(identity('0'.repeat(200)).slice(6) === '0'.repeat(97) + '...');

export function text(source: HTMLElement | DocumentFragment, optional = false): string {
  assert(source instanceof DocumentFragment || !source.matches('.indexer'));
  assert(source.querySelectorAll(':scope > .indexer').length <= 1);
  const indexer = source.querySelector(':scope > .indexer');
  if (!indexer && optional) return '';
  const index = indexer?.getAttribute('data-index');
  if (index) return index;
  assert(!source.querySelector('.annotation, br'));
  const target = source.cloneNode(true) as typeof source;
  for (
    let es = target.querySelectorAll('code[data-src], .math[data-src], .comment, rt, rp, .reference, .checkbox, ul, ol'),
        i = 0, len = es.length; i < len; ++i) {
    const el = es[i];
    switch (el.tagName) {
      case 'CODE':
        define(el, el.getAttribute('data-src')!);
        continue;
      case 'RT':
      case 'RP':
      case 'UL':
      case 'OL':
        el.remove();
        continue;
    }
    switch (el.className) {
      case 'math':
        define(el, el.getAttribute('data-src')!);
        continue;
      case 'comment':
      case 'checkbox':
        el.remove();
        continue;
      case 'reference':
        assert(el.firstElementChild?.hasAttribute('hidden'));
        el.firstChild!.remove();
        continue;
    }
  }
  // Better:
  //return target.innerText;
  return target.textContent!;
}
