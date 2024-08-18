import { MarkdownParser } from '../../../../markdown';
import { Parser } from '../../../combinator/data/parser';
import { fmap } from '../../../combinator';
import { reduce } from 'spica/memoize';
import { define } from 'typed-dom/dom';

export function indexee<P extends Parser<unknown, MarkdownParser.Context>>(parser: P): P;
export function indexee(parser: Parser<HTMLElement, MarkdownParser.Context>): Parser<HTMLElement> {
  return fmap(parser, ([el], _, { id }) => [define(el, { id: identity(id, el) })]);
}

const MAX = 60;
const ELLIPSIS = '...';
const PART = (MAX - ELLIPSIS.length) / 2 | 0;
const REM = MAX - PART * 2 - ELLIPSIS.length;
export function identity(
  id: string | undefined,
  text: string | HTMLElement,
  type: 'index' | 'mark' | '' = 'index',
): string | undefined {
  assert(id?.match(/^[0-9a-z/-]*$/i) ?? true);
  if (id === '') return undefined;
  if (typeof text !== 'string') {
    const index = text.querySelector(':scope > .indexer')?.getAttribute('data-index');
    if (index === '' && text.tagName === 'LI') return undefined;
    return index
      ? `${type}:${id ?? ''}:${index}`
      : identity(id, signature(text), type);
  }
  text = text.trim();
  if (text === '') return undefined;
  const str = text.replace(/\s/g, '_');
  const cs = [...str];
  if (type === '') return `${type}:${id ?? ''}:${str}`;
  if (cs.length <= MAX) return `${type}:${id ?? ''}:${str}${
    /_|[^\S ]|=[0-9a-z]{1,7}$/.test(text) ? `=${hash(text).toString(36)}` : ''
  }`;
  switch (type) {
    case 'index':
    case 'mark':
      const s1 = cs.slice(0, PART + REM).join('');
      const s2 = cs.slice(-PART).join('');
      assert([...`${s1}${ELLIPSIS}${s2}`].length === MAX);
      return `${type}:${id ?? ''}:${s1}${ELLIPSIS}${s2}=${hash(text).toString(36)}`;
  }
  assert(false);
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
  identity(undefined, ` ${'0 '.repeat(MAX)}`),
  identity(undefined, ` ${'0 '.repeat(MAX)}`.trim()));
assert.notDeepStrictEqual(
  identity(undefined, `${'0 '.repeat(MAX)}0`),
  identity(undefined, `${'0_'.repeat(MAX)}0`));
assert.notDeepStrictEqual(
  identity(undefined, `${'0 '.repeat(MAX)}0`),
  identity(undefined, `${'0\t'.repeat(MAX)}0`));
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
assert(hash('\x00') !== 0);
assert(hash('\x01') !== 0);
assert(hash('\x00') !== hash(String.fromCharCode(1 << 15)));

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
