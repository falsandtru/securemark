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
  text &&= text.trim().replace(/\s\s+/g, ' ');
  if (text === '') return undefined;
  const hash = text.replace(/\s/g, '_');
  if (hash.length <= 120 || type === '') return `${type}:${id ?? ''}:${hash}`;
  const cs = [...text];
  if (cs.length <= 120) return `${type}:${id ?? ''}:${hash}`;
  const ellipsis = '...';
  const len = (120 - ellipsis.length * 2) / 3 | 0;
  switch (type) {
    case 'index':
    case 'mark':
      const s1 = hash.slice(0, cs.slice(0, len).join('').trimEnd().length);
      const s3 = hash.slice(-cs.slice(-len).join('').trimStart().length);
      const s2 = cs.slice(cs.length / 2 - len / 2 - (len - s1.length) | 0).slice(0, len + len - s3.length).join('').trim().replace(/\s/g, '_');
      return `${type}:${id ?? ''}:${s1}${ellipsis}${s2}${ellipsis}${s3}`;
  }
  assert(false);
}
assert(identity(undefined, '0'.repeat(120 - 1) + 1)!.slice(7) === '0'.repeat(120 - 1) + 1);
assert(identity(undefined, '0'.repeat(41) + '1'.repeat(38) + '2'.repeat(41) + 3)!.slice(7) === '0'.repeat(38) + '...' + '1'.repeat(38) + '...' + '2'.repeat(38 - 1) + 3);
assert(identity(undefined, '0'.repeat(81) + '1'.repeat(38) + '2'.repeat(81) + 3)!.slice(7) === '0'.repeat(38) + '...' + '1'.repeat(38) + '...' + '2'.repeat(38 - 1) + 3);

export function index(source: Element, optional = false): string {
  assert(!source.matches('.indexer'));
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
  for (let es = target.querySelectorAll('code[data-src], .math[data-src], .label[data-label], .remark, rt, rp, br, .annotation, .reference, .checkbox, ul, ol'),
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
      case 'remark':
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
  for (let es = target.querySelectorAll('code[data-src], .math[data-src], .remark, rt, rp, br, .annotation, .reference, .checkbox, ul, ol'),
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
      case 'remark':
      case 'checkbox':
      case 'annotation':
      case 'reference':
        el.remove();
        continue;
    }
  }
  return target.textContent!;
});
