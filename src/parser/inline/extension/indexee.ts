import { MarkdownParser } from '../../../../markdown';
import { Parser } from '../../../combinator/data/parser';
import { fmap } from '../../../combinator';
import { reduce } from 'spica/memoize';
import { define } from 'typed-dom/dom';

export function indexee<P extends Parser<unknown, MarkdownParser.Context>>(parser: P, optional?: boolean): P;
export function indexee(parser: Parser<HTMLElement, MarkdownParser.Context>, optional?: boolean): Parser<HTMLElement> {
  return fmap(parser, ([el], _, { id }) => [define(el, { id: identity(id, index(el, optional)) })]);
}

export function identity(id: string | undefined, text: string, type: 'index' | 'mark' | '' = 'index'): string | undefined {
  assert(!id?.match(/[^0-9a-z/-]/i));
  assert(!text.includes('\n'));
  if (id === '') return undefined;
  text &&= text.trim().replace(/\s+/g, '_');
  if (text === '') return undefined;
  if (text.length <= 100 || type === '') return `${type}:${id ?? ''}:${text}`;
  const cs = [...text];
  if (cs.length <= 100) return `${type}:${id ?? ''}:${text}`;
  switch (type) {
    case 'index':
      return `${type}:${id ?? ''}:${cs.slice(0, 97).join('')}...`;
    case 'mark':
      return `${type}:${id ?? ''}:${cs.slice(0, 31).join('')}...${cs.slice(cs.length / 2 - 32 / 2 | 0).slice(0, 32).join('')}...${cs.slice(-31).join('')}`;
  }
  assert(false);
}
assert(identity(undefined, '0'.repeat(100 - 1) + 1)!.slice(7) === '0'.repeat(100 - 1) + 1);
assert(identity(undefined, '0'.repeat(100) + 1)!.slice(7) === '0'.repeat(97) + '...');
assert(identity(undefined, '0'.repeat(200) + 1)!.slice(7) === '0'.repeat(97) + '...');
assert(identity(undefined, '0'.repeat(100 - 1) + 1, 'mark')!.slice(6) === '0'.repeat(100 - 1) + 1);
assert(identity(undefined, '0'.repeat(34) + '1'.repeat(32) + '2'.repeat(34) + 3, 'mark')!.slice(6) === '0'.repeat(31) + '...' + '1'.repeat(32) + '...' + '2'.repeat(31 - 1) + 3);
assert(identity(undefined, '0'.repeat(84) + '1'.repeat(32) + '2'.repeat(84) + 3, 'mark')!.slice(6) === '0'.repeat(31) + '...' + '1'.repeat(32) + '...' + '2'.repeat(31 - 1) + 3);

export function index(source: Element, optional = false): string {
  assert(source instanceof DocumentFragment || !source.matches('.indexer'));
  assert(source.querySelectorAll(':scope > .indexer').length <= 1);
  if (!source.firstChild) return '';
  const indexer = source.querySelector(':scope > .indexer');
  const index = indexer?.getAttribute('data-index');
  if (index) return index;
  if (index === '' && optional) return '';
  return signature(source);
}

export function signature(source: Element | DocumentFragment): string {
  assert(!navigator.userAgent.includes('Chrome') || !source.querySelector('br:not(:has(+ :is(ul, ol)))'));
  const target = source.cloneNode(true) as typeof source;
  for (let es = target.querySelectorAll('code[data-src], .math[data-src], .label[data-label], .comment, rt, rp, br, .annotation, .reference, .checkbox, ul, ol'),
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
      case 'label':
        el.replaceWith(`[$${el.getAttribute('data-label')!.replace('$', '')}]`);
        continue;
      case 'comment':
      case 'checkbox':
      case 'annotation':
      case 'reference':
        el.remove();
        continue;
    }
  }
  return target.textContent!.trim();
}

export const text = reduce((source: Element | DocumentFragment): string => {
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
  return target.textContent!;
});
