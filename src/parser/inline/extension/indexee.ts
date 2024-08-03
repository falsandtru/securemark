import { MarkdownParser } from '../../../../markdown';
import { Parser } from '../../../combinator/data/parser';
import { fmap } from '../../../combinator';
import { reduce } from 'spica/memoize';
import { define } from 'typed-dom/dom';

export function indexee<P extends Parser<unknown, MarkdownParser.Context>>(parser: P, optional?: boolean): P;
export function indexee(parser: Parser<HTMLElement, MarkdownParser.Context>, optional?: boolean): Parser<HTMLElement> {
  return fmap(parser, ([el], _, { id }) => [define(el, { id: identity(id, index(el, optional)) })]);
}

const MAX = 120;
const ELLIPSIS = '...';
const PART = (MAX - ELLIPSIS.length * 2) / 3 | 0;
const REM = MAX - PART * 3 - ELLIPSIS.length * 2;
export function identity(
  id: string | undefined,
  text: string, type: 'index' | 'mark' | '' = 'index',
): string | undefined {
  assert(!id?.match(/[^0-9a-z/-]/i));
  assert(!text.includes('\n'));
  if (id === '') return undefined;
  text = text.trim().replace(/\s/g, '_');
  if (text === '') return undefined;
  if (text.length <= MAX || type === '') return `${type}:${id ?? ''}:${text}`;
  const cs = [...text];
  if (cs.length <= MAX) return `${type}:${id ?? ''}:${text}`;
  switch (type) {
    case 'index':
    case 'mark':
      const s1 = cs.slice(0, PART).join('');
      const s3 = cs.slice(-PART).join('');
      const s2 = cs.slice(cs.length / 2 - PART / 2 - REM | 0).slice(0, PART + REM).join('');
      return `${type}:${id ?? ''}:${s1}${ELLIPSIS}${s2}${ELLIPSIS}${s3}=${hash(text).toString(36)}`;
  }
  assert(false);
}
function hash(source: string): number {
  let x = 1;
  assert(x !== 0);
  for (let i = 0; i < source.length; ++i) {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 15;
    x ^= source.charCodeAt(i) << 11;
  }
  return x >>> 0;
}
assert.deepStrictEqual(
  identity(undefined, '0'.repeat(MAX - 1) + '1')!.slice(7),
  '0'.repeat(MAX - 1) + '1');
assert.deepStrictEqual(
  identity(undefined, '0'.repeat(MAX / 3) + '1'.repeat(MAX / 3) + '2'.repeat(MAX / 3) + '3')!.slice(7),
  '0'.repeat(PART) + ELLIPSIS + '1'.repeat(PART + REM) + ELLIPSIS + '2'.repeat(PART - 1) + '3' + '=pbenrm');
assert.deepStrictEqual(
  identity(undefined, '0'.repeat(MAX / 3 * 2) + '1'.repeat(MAX / 3) + '2'.repeat(MAX / 3 * 2) + '3')!.slice(7),
  '0'.repeat(PART) + ELLIPSIS + '1'.repeat(PART + REM) + ELLIPSIS + '2'.repeat(PART - 1) + '3' + '=fllnep');

export function index(source: Element, optional = false): string {
  assert(!source.matches('.indexer'));
  assert(source.querySelectorAll(':scope > .indexer').length <= 1);
  if (!source.firstChild) return '';
  const indexer = source.querySelector(':scope > .indexer');
  const index = indexer?.getAttribute('data-index');
  if (index) return index.replace(/=\w+$/, '');
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
