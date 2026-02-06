import { MarkdownParser } from '../../../../markdown';
import { Parser } from '../../../combinator/data/parser';
import { fmap } from '../../../combinator';
import { define } from 'typed-dom/dom';

export function indexee<P extends Parser<unknown, MarkdownParser.Context>>(parser: P): P;
export function indexee(parser: Parser<HTMLElement, MarkdownParser.Context>): Parser<HTMLElement> {
  return fmap(parser, ([el], _, { id }) => [define(el, { id: identity('index', id, el), 'data-index': null })]);
}

const MAX = 60;
const ELLIPSIS = '...';
const PART = (MAX - ELLIPSIS.length) / 2 | 0;
const REM = MAX - PART * 2 - ELLIPSIS.length;
const table = [
  ...[...Array(36)].map((_, i) => i.toString(36)),
  ...[...Array(36)].map((_, i) => i.toString(36).toUpperCase()).slice(-26),
  '-', '=',
].join('');
assert(table.length === 64);
export function identity(
  type: 'index' | 'mark' | '',
  id: string | undefined,
  text: string | HTMLElement,
): string | undefined {
  assert(id?.match(/^[0-9a-z/-]*$/i) ?? true);
  if (id === '') return undefined;
  if (typeof text !== 'string') {
    const index = text.getAttribute('data-index') ?? undefined;
    if (index === '' && text.tagName === 'LI') return undefined;
    return index
      ? `${type}:${id ?? ''}:${index}`
      : identity(type, id, signature(text));
  }
  text = text.trim();
  if (text === '') return undefined;
  const str = text.replace(/\s/g, '_');
  const cs = [...str];
  if (type === '' || cs.length <= MAX) {
    return `${type}:${id ?? ''}:${str}${/_|[^\S ]|=[0-9A-Za-z]{1,6}$/.test(text) ? `=${hash(text)}` : ''}`;
  }
  const s1 = cs.slice(0, PART + REM).join('');
  const s2 = cs.slice(-PART).join('');
  assert([...`${s1}${ELLIPSIS}${s2}`].length === MAX);
  return `${type}:${id ?? ''}:${s1}${ELLIPSIS}${s2}=${hash(text)}`;
}
assert.deepStrictEqual(
  identity('index', undefined, ' 0 '),
  identity('index', undefined, ' 0 '.trim()));
assert.notDeepStrictEqual(
  identity('index', undefined, '0 0'),
  identity('index', undefined, '0  0'));
assert.notDeepStrictEqual(
  identity('index', undefined, '0 0'),
  identity('index', undefined, '0_0'));
assert.notDeepStrictEqual(
  identity('index', undefined, '0 0'),
  identity('index', undefined, '0\t0'));
assert.notDeepStrictEqual(
  identity('index', undefined, '0_0'),
  identity('index', undefined, identity('index', undefined, '0_0')!.slice(7).replace('_', ' ')));
assert.deepStrictEqual(
  identity('index', undefined, `${'0'.repeat(MAX - 1)}1`)!.slice(7),
  `${'0'.repeat(MAX - 1)}1`);
assert.deepStrictEqual(
  identity('index', undefined, `0${'1'.repeat(MAX / 2)}${'2'.repeat(MAX / 2)}3`)!.slice(7),
  `0${'1'.repeat(PART + REM - 1)}${ELLIPSIS}${'2'.repeat(PART - 1)}3=MYkmc`);
assert.deepStrictEqual(
  identity('index', undefined, `0${'1'.repeat(MAX * 2)}${'2'.repeat(MAX * 2)}3`)!.slice(7),
  `0${'1'.repeat(PART + REM - 1)}${ELLIPSIS}${'2'.repeat(PART - 1)}3=3bF8VU`);
function hash(source: string): string {
  let x = 0;
  for (let i = 0; i < source.length; ++i) {
    const c = source.charCodeAt(i);
    x = x ^ c << 1 || ~x ^ c << 1; // 16+1bit
    assert(x !== 0);
    x ^= x << 13; // shift <= 32-17bit
    x ^= x >>> 17;
    x ^= x << 15;
  }
  return baseR(x >>> 0, 62);
}
assert(hash('\x00') !== '0');
assert(hash('\x01') !== '0');
assert(hash('\x00') !== hash(String.fromCharCode(1 << 15)));
// 62も64も最大6桁
function baseR(n: number, r: number): string {
  assert(n >= 0);
  assert(Math.floor(n) === n);
  assert(r <= 64);
  let acc = '';
  do {
    const mod = n % r;
    n = (n - mod) / r;
    assert(Math.floor(n) === n);
    acc = table[mod] + acc;
  } while (n > 0)
  assert(acc !== '');
  return acc;
}
assert(baseR(0, 36) === (0).toString(36));
assert(baseR(~0 >>> 0, 36) === (~0 >>> 0).toString(36));
assert(baseR(61, 62) === 'Z');
assert(baseR(62, 62) === '10');

export function signature(source: Element | DocumentFragment): string {
  assert(!navigator.userAgent.includes('Chrome') || !source.querySelector('br:not(:has(+ :is(ul, ol)))') || source.nodeName === 'MARK');
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
      case 'UL':
      case 'OL':
        el.remove();
        continue;
      case 'BR':
        el.replaceWith('\n');
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

export function text(source: Element | DocumentFragment): string {
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
}
