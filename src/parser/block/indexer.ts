import { Result } from '../../combinator';
import { IndexerParser } from '../block';
import { ExtensionParser, inline } from '../inline';
import { makeIndex } from '../string/index';

const syntax = /^\s+\[#\S+?\]$/;

export const indexer: IndexerParser = function (source: string): Result<HTMLElement, [ExtensionParser.IndexParser]> {
  assert(!source.match(/\n/));
  if (!source.trim().startsWith('[#') || source.search(syntax) !== 0) return;
  assert(source.endsWith(']'));
  source = source.trim();
  assert(source.startsWith('[#'));
  const [[el], rest] = inline(source) || [[document.createTextNode('')], ''];
  if (!(el instanceof HTMLAnchorElement)) return;
  if (rest !== '') return;
  assert(el.matches(`a[href^="#${makeIndex('')}"]`));
  void el.setAttribute('class', 'index');
  return [[el], ''];
};

export function defineIndex(target: HTMLElement): void {
  assert(!target.hasAttribute('id'));
  const el = target.querySelector('.index') || target.cloneNode(true) as HTMLElement;
  void el.remove();
  void [...el.querySelectorAll('code[data-src], .math[data-src]')]
    .forEach(el =>
      el.textContent = el.getAttribute('data-src'));
  const text = el.textContent!.trim();
  if (text === '') return;
  void target.setAttribute('id', makeIndex(text));
}
