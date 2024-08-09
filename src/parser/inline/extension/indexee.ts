import { MarkdownParser } from '../../../../markdown';
import { Parser } from '../../../combinator/data/parser';
import { fmap } from '../../../combinator';
import { reduce } from 'spica/memoize';
import { define } from 'typed-dom/dom';

export function indexee<P extends Parser<unknown, MarkdownParser.Context>>(parser: P, optional?: boolean): P;
export function indexee(parser: Parser<HTMLElement, MarkdownParser.Context>, optional?: boolean): Parser<HTMLElement> {
  return fmap(parser, ([el], _, { id }) => [define(el, { id: identity(id, index(el, optional)) })]);
}

const MAX = 60;
const ELLIPSIS = '...';
const PART = (MAX - ELLIPSIS.length) / 2 | 0;
const REM = MAX - PART * 2 - ELLIPSIS.length;
export function identity(
  id: string | undefined,
  text: string,
  type: 'index' | 'mark' | '' = 'index',
): string | undefined {
  assert(!id?.match(/[^0-9a-z/-]/i));
  assert(!text.includes('\n'));
  if (id === '') return undefined;
  text = text.trim();
  if (text === '') return undefined;
  const str = text.replace(/\s/g, '_');
  if (str.length <= MAX || type === '') return `${type}:${id ?? ''}:${str}`;
  const cs = [...str];
  if (cs.length <= MAX) return `${type}:${id ?? ''}:${str}`;
  switch (type) {
    case 'index':
    case 'mark':
      const s1 = cs.slice(0, PART + REM).join('');
      const s2 = cs.slice(-PART).join('');
      return `${type}:${id ?? ''}:${s1}${ELLIPSIS}${s2}=${hash(text).toString(36)}`;
  }
  assert(false);
}
function hash(source: string): number {
  let x = 0;
  for (let i = 0; i < source.length; ++i) {
    x ^= source.charCodeAt(i) << 1 | 1; // 16+1bit
    x ^= x << 13; // shift <= 32-17bit
    x ^= x >>> 17;
    x ^= x << 15;
  }
  return x >>> 0;
}
assert.deepStrictEqual(
  identity(undefined, `${'0'.repeat(MAX - 1)}1`)!.slice(7),
  `${'0'.repeat(MAX - 1)}1`);
assert.deepStrictEqual(
  identity(undefined, `0${'1'.repeat(MAX / 2)}${'2'.repeat(MAX / 2)}3`)!.slice(7),
  `0${'1'.repeat(PART + REM - 1)}${ELLIPSIS}${'2'.repeat(PART - 1)}3=mhy513`);
assert.deepStrictEqual(
  identity(undefined, `0${'1'.repeat(MAX * 2)}${'2'.repeat(MAX * 2)}3`)!.slice(7),
  `0${'1'.repeat(PART + REM - 1)}${ELLIPSIS}${'2'.repeat(PART - 1)}3=12jqtiv`);
assert.deepStrictEqual(
  identity(undefined, ` ${'0 '.repeat(MAX)}`)!.slice(7),
  identity(undefined, ` ${'0 '.repeat(MAX)}`.trim())!.slice(7));
assert.notDeepStrictEqual(
  identity(undefined, `${'0 '.repeat(MAX)}`)!.slice(7),
  identity(undefined, `${'0_'.repeat(MAX)}`)!.slice(7));

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
