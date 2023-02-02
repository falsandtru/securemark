import { MarkdownParser } from '../../../../markdown';
import { Parser } from '../../../combinator/data/parser';
import { fmap } from '../../../combinator';
import { define } from 'typed-dom/dom';

export function indexee<P extends Parser<unknown, MarkdownParser.Context>>(parser: P, optional?: boolean): P;
export function indexee(parser: Parser<HTMLElement, MarkdownParser.Context>, optional?: boolean): Parser<HTMLElement> {
  return fmap(parser, ([el], _, { id }) => [define(el, { id: id !== '' && identity(text(el, optional)) || undefined })]);
}

export function identity(text: string, name: 'index' | 'mark' = 'index'): string {
  assert(!text.includes('\n'));
  text &&= text.trim().replace(/\s+/g, '_');
  if (text.length <= 100) return text && `${name}:${text}`;
  switch (name) {
    case 'index':
      return `${name}:${text.slice(0, 97)}...`;
    case 'mark':
      return `${name}:${text.slice(0, 50)}...${text.slice(-47)}`;
  }
}
assert(identity('0'.repeat(100 - 1) + 1).slice(6) === '0'.repeat(100 - 1) + 1);
assert(identity('0'.repeat(100) + 1).slice(6) === '0'.repeat(97) + '...');
assert(identity('0'.repeat(200) + 1).slice(6) === '0'.repeat(97) + '...');
assert(identity('0'.repeat(100 - 1) + 1, 'mark').slice(5) === '0'.repeat(100 - 1) + 1);
assert(identity('0'.repeat(100) + 1, 'mark').slice(5) === '0'.repeat(50) + '...' + '0'.repeat(47 - 1) + 1);
assert(identity('0'.repeat(200) + 1, 'mark').slice(5) === '0'.repeat(50) + '...' + '0'.repeat(47 - 1) + 1);

export function text(source: HTMLElement | DocumentFragment, optional = false): string {
  assert(source instanceof DocumentFragment || !source.matches('.indexer'));
  assert(source.querySelectorAll(':scope > .indexer').length <= 1);
  const indexer = source.querySelector(':scope > .indexer');
  if (!indexer && optional) return '';
  const index = indexer?.getAttribute('data-index');
  if (index) return index;
  assert(!source.querySelector('br'));
  const target = source.cloneNode(true) as typeof source;
  for (let es = target.querySelectorAll('code[data-src], .math[data-src], .comment, rt, rp, br, .annotation, .reference, .checkbox, ul, ol'),
           len = es.length, i = 0; i < len; ++i) {
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
      case 'BR':
        el.replaceWith('\n');
        continue;
    }
    switch (el.className) {
      case 'math':
        define(el, el.getAttribute('data-src')!);
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
