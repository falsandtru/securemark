import { Result } from '../../combinator/parser';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { HeadingParser, IndexerParser, consumeBlockEndEmptyLine } from '../block';
import { indexer, defineIndex } from './indexer';
import { InlineParser, inline } from '../inline';
import { squash } from '../text';

type SubParsers = [IndexerParser, InlineParser];

const syntax = /^(#{1,6})\s+?([^\n]+)/;

export const heading: HeadingParser = function (source: string): Result<HTMLHeadingElement, SubParsers> {
  if (!source.startsWith('#')) return;
  const [whole, { length: level }, title] = source.split('\n', 1).shift()!.match(syntax) || ['', '', ''];
  if (!whole) return;
  assert(level > 0 && level < 7);
  assert(title.length > 0);
  const [children] = loop(combine<SubParsers, HTMLElement | Text>([indexer, inline]))(title.trim()) || [[]];
  const el = document.createElement(<'h1'>`h${level}`);
  void el.appendChild(squash(children));
  void defineIndex(el);
  return consumeBlockEndEmptyLine<HTMLHeadingElement, SubParsers>([el], source.slice(whole.length + 1));
};
