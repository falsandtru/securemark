import { IndexerParser } from '../block';
import { union, surround, transform, trim } from '../../combinator';
import { line } from '../source/line';
import { index } from '../inline';

export const indexer: IndexerParser = line(transform(
  surround(/^\s+?(?=\[#)/, trim(union([index])), /$/),
  ([el], rest) => {
    if (!el) return;
    assert(el.getAttribute('href')!.startsWith(`#${makeIndex('')}`));
    void el.setAttribute('class', 'index');
    return [[el], rest];
  }));

export function defineIndex(source: HTMLElement): void {
  if (source.hasAttribute('id')) return;
  const index = source.querySelector('.index');
  const id = text(index || source);
  if (id === '') return;
  index && void index.remove();
  void source.setAttribute('id', makeIndex(id));
}

export function text(source: Element): string {
  const target = source.cloneNode(true);
  void [...target.querySelectorAll('code[data-src], .math[data-src]')]
    .forEach(el =>
      el.textContent = el.getAttribute('data-src'));
  return target.textContent!.trim();
}

function makeIndex(text: string): string {
  assert(!text.includes('\n'));
  return `index:${text.trim().replace(/\s+/g, '-').toLowerCase()}`;
}
