import { Parser, List, Node } from '../../../combinator/data/parser';
import { Context } from '../../context';
import { fmap } from '../../../combinator';
import { define } from 'typed-dom/dom';

export function indexee<P extends Parser<HTMLElement, Context>>(parser: P): P;
export function indexee(parser: Parser<HTMLElement, Context>): Parser<HTMLElement> {
  return fmap(parser, (ns, { id }) =>
    ns.length === 1
      ? new List([new Node(define(ns.head!.value, { id: identity('index', id, ns.head!.value), 'data-index': null }))])
      : ns);
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
      : identity(type, id, signature(text.cloneNode(true)));
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

export function signature(target: Element | DocumentFragment): string {
  assert(!target.parentNode);
  assert(!target.querySelector('br:not(:has(+ :is(ul, ol)))') || target.nodeName === 'MARK');
  for (let es = target.querySelectorAll('code[data-src], .math[data-src], .remark, rt, rp, br, .annotation, .reference, :is(.annotation, .reference) > a, .checkbox, ul, ol, .label[data-label]'),
           i = es.length; i--;) {
    const el = es[i];
    switch (el.className) {
      case 'math':
        el.replaceWith(el.getAttribute('data-src')!);
        continue;
      case 'label':
        el.replaceWith(`[$${el.getAttribute('data-label')!.replace('$', '')}]`);
        continue;
      case 'annotation':
        el.replaceWith(`((${el.textContent}))`);
        continue;
      case 'reference':
        const abbr = el.getAttribute('data-abbr');
        el.replaceWith(`[[${abbr ? `^${abbr}` : el.textContent}]]`);
        continue;
      case 'checkbox':
      case 'remark':
        el.remove();
        continue;
    }
    switch (el.tagName) {
      case 'CODE':
        el.replaceWith(el.getAttribute('data-src')!);
        continue;
      case 'UL':
      case 'OL':
      case 'RT':
      case 'RP':
      case 'A':
        el.remove();
        continue;
      case 'BR':
        el.replaceWith('\n');
        continue;
    }
  }
  return target.textContent!.trim();
}

export function text(target: Element | DocumentFragment): string {
  assert(!target.parentNode);
  assert(!target.querySelector('br:not(:has(+ :is(ul, ol)))'));
  for (let es = target.querySelectorAll('code[data-src], .math[data-src], .remark, rt, rp, br, .annotation, .reference, :is(.annotation, .reference) > a, .checkbox, ul, ol'),
           i = es.length; i--;) {
    const el = es[i];
    switch (el.className) {
      case 'math':
        el.replaceWith(el.getAttribute('data-src')!);
        continue;
      case 'annotation':
        el.replaceWith(`((${el.textContent}))`);
        continue;
      case 'reference':
        const abbr = el.getAttribute('data-abbr');
        el.replaceWith(`[[${abbr ? `^${abbr}` : el.textContent}]]`);
        continue;
      case 'checkbox':
      case 'remark':
        el.remove();
        continue;
    }
    switch (el.tagName) {
      case 'CODE':
        el.replaceWith(el.getAttribute('data-src')!);
        continue;
      case 'UL':
      case 'OL':
      case 'RT':
      case 'RP':
      case 'A':
      case 'BR':
        el.remove();
        continue;
    }
  }
  return target.textContent!;
}
