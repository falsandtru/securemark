import { MarkdownParser } from '../../../../markdown';
import { Parser } from '../../../combinator/data/parser';
import { fmap } from '../../../combinator';
import { define } from 'typed-dom/dom';

export function indexee<P extends Parser<unknown, MarkdownParser.Context>>(parser: P, optional?: boolean): P;
export function indexee(parser: Parser<HTMLElement, MarkdownParser.Context>, optional?: boolean): Parser<HTMLElement> {
  return fmap(parser, ([el], _, { id }) => [define(el, { id: identity(id, text(el, optional)) })]);
}

export function identity(id: string | undefined, text: string, name: 'index' | 'mark' = 'index'): string | undefined {
  assert(!id?.match(/[^0-9a-z-]/i));
  assert(!text.includes('\n'));
  if (id === '') return undefined;
  text &&= text.trim().replace(/\s+/g, '_');
  if (text === '') return undefined;
  if (text.length <= 100) return `${name}:${id ?? ''}:${text}`;
  switch (name) {
    case 'index':
      return `${name}:${id ?? ''}:${text.slice(0, 97)}...`;
    case 'mark':
      return `${name}:${id ?? ''}:${text.slice(0, 50)}...${text.slice(-47)}`;
  }
  assert(false);
}
assert(identity(undefined, '0'.repeat(100 - 1) + 1)!.slice(7) === '0'.repeat(100 - 1) + 1);
assert(identity(undefined, '0'.repeat(100) + 1)!.slice(7) === '0'.repeat(97) + '...');
assert(identity(undefined, '0'.repeat(200) + 1)!.slice(7) === '0'.repeat(97) + '...');
assert(identity(undefined, '0'.repeat(100 - 1) + 1, 'mark')!.slice(6) === '0'.repeat(100 - 1) + 1);
assert(identity(undefined, '0'.repeat(100) + 1, 'mark')!.slice(6) === '0'.repeat(50) + '...' + '0'.repeat(47 - 1) + 1);
assert(identity(undefined, '0'.repeat(200) + 1, 'mark')!.slice(6) === '0'.repeat(50) + '...' + '0'.repeat(47 - 1) + 1);

export function text(source: HTMLElement | DocumentFragment, optional = false): string {
  assert(source instanceof DocumentFragment || !source.matches('.indexer'));
  assert(source.querySelectorAll(':scope > .indexer').length <= 1);
  const indexer = source.querySelector(':scope > .indexer');
  const index = indexer?.getAttribute('data-index');
  if (index) return index;
  if (index === '' && optional) return '';
  assert(!navigator.userAgent.includes('Chrome') || !source.querySelector('br:not(:has(+ :is(ul, ol)))'));
  const target = source.cloneNode(true) as typeof source;
  for (let es = target.querySelectorAll('code[data-src], .math[data-src], .comment, rt, rp, br, .annotation, .reference, .checkbox, ul, ol'),
           len = es.length, i = 0; i < len; ++i) {
    const el = es[i];
    switch (el.tagName) {
      case 'CODE':
        el.replaceWith(el.getAttribute('data-src')!);
        continue;
      case 'RT':
      case 'RP':
      case 'BR':
      case 'UL':
      case 'OL':
        el.remove();
        continue;
    }
    switch (el.className) {
      case 'math':
        el.replaceWith(el.getAttribute('data-src')!);
        continue;
      case 'comment':
      case 'checkbox':
      case 'annotation':
      case 'reference':
        el.remove();
        continue;
    }
  }
  // Better:
  //return target.innerText;
  return target.textContent!;
}
