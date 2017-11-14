import { HeadingParser } from '../block';
import { verifyBlockEnd } from './end';
import { combine, loop } from '../../combinator';
import { indexer, defineIndex } from './indexer';
import { inline } from '../inline';
import { squash } from '../squash';

const syntax = /^(#{1,6})[^\S\n]+?([^\n]+)/;

export const heading: HeadingParser = verifyBlockEnd((source: string): [[HTMLHeadingElement], string] | undefined => {
  if (!source.startsWith('#')) return;
  const [whole, { length: level }, title] = source.split('\n', 1).shift()!.match(syntax) || ['', '', ''];
  if (!whole) return;
  assert(level > 0 && level < 7);
  assert(title.length > 0);
  const [children, rest = undefined] = loop(combine<HTMLElement | Text, HeadingParser.InnerParsers>([indexer, inline]))(title.trim()) || [[]];
  if (rest === undefined) return;
  const el = document.createElement(<'h1'>`h${level}`);
  void el.appendChild(squash(children));
  void defineIndex(el);
  return [[el], source.slice(whole.length + 1)];
});
