import { Result } from '../../combinator/parser';
import { IndexParser } from '../text';

const syntax = /^\s+\[(#\S+?)\]$/;

export const index: IndexParser = function (source: string): Result<HTMLElement, [never]> {
  const [whole, hash] = source.match(syntax) || ['', ''];
  if (!whole) return;
  assert(hash.length > 1);
  assert(hash.trim() === hash);
  assert(!source.match(/\n|\s+$/));
  const el = document.createElement('span');
  void el.setAttribute('class', 'index');
  void el.appendChild(document.createTextNode(hash.slice(1)));
  assert(source.slice(whole.length) === '');
  return [[el], ''];
};

export function idxhash(str: string): string {
  return `index:${str.trim().replace(/\s+/g, '-')}`;
}
