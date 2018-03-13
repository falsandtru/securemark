import { IndexerParser } from '../block';
import { index } from '../inline';

const syntax = /^[^\S\n\[]+(\[#[^\s\]]+\])[^\S\n]*(?:\n|$)/;

export const indexer: IndexerParser = source => {
  const [whole = '', idx = ''] = source.match(syntax) || [];
  if (!whole) return;
  assert(idx === idx.trim());
  const [[el = undefined] = []] = index(idx) || [];
  if (!el) return;
  assert(el.getAttribute('href')!.startsWith(`#${makeIndex('')}`));
  void el.setAttribute('class', 'index');
  return [[el], source.slice(whole.length)];
};

export function defineIndex(target: HTMLElement): void {
  if (target.hasAttribute('id')) return;
  const id = text(target);
  if (id === '') return;
  void target.setAttribute('id', makeIndex(id));
}

export function text(target: Element): string {
  const el = target.querySelector('.index') || target.cloneNode(true);
  void el.remove();
  void [...el.querySelectorAll('code[data-src], .math[data-src]')]
    .forEach(el =>
      el.textContent = el.getAttribute('data-src'));
  return el.textContent!.trim();
}

function makeIndex(text: string): string {
  assert(!text.includes('\n'));
  return `index:${text.trim().replace(/\s+/g, '-').toLowerCase()}`;
}
