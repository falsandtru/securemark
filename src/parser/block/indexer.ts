import { Result } from '../../combinator/parser';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { IndexerParser } from '../block';
import { TextParser, squash } from '../text';
import { text } from '../text/text';
import { makeIndex } from '../text/index';

type SubParsers = [TextParser];

const syntax = /^\s+\[(#\S+?)\]$/;

export const indexer: IndexerParser = function (source: string): Result<HTMLElement, [never]> {
  assert(!source.match(/\n/));
  if (!source.trim().startsWith('[#') || source.search(syntax) !== 0) return;
  assert(source.endsWith(']'));
  source = source.trim();
  assert(source.startsWith('[#'));
  const [cs, rest] = loop(combine<SubParsers, HTMLElement | Text>([text]), /^\]/)(source.slice(2)) || [[], ''];
  if (rest !== ']') return;
  const el = document.createElement('span');
  void el.setAttribute('class', 'index');
  void el.appendChild(squash(cs));
  if (el.textContent! !== el.textContent!.trim()) return;
  return [[el], ''];
};

export function defineIndex(target: HTMLElement): void {
  assert(!target.hasAttribute('id'));
  const el = target.querySelector('.index') || target.cloneNode(true) as HTMLElement;
  void el.remove();
  void Array.from(el.querySelectorAll('code[data-src], .math[data-src]'))
    .forEach(el =>
      el.textContent = el.getAttribute('data-src'));
  const text = el.textContent!.trim();
  if (text === '') return;
  void target.setAttribute('id', makeIndex(text));
}
