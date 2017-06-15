import { Result } from '../../parser';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { HeadingParser, consumeBlockEndEmptyLine } from '../block';
import { InlineParser, inline } from '../inline';
import { squash } from '../text';

type SubParsers = [InlineParser];

const syntax = /^(#{1,6})\s+?([^\n]+)/;

export const heading: HeadingParser = function (source: string): Result<HTMLHeadingElement, SubParsers> {
  const [whole, {length: level}, title] = source.match(syntax) || ['', '', ''];
  if (!whole) return;
  assert(level > 0 && level < 7);
  assert(title.length > 0);
  const [children] = loop(combine<SubParsers, HTMLElement | Text>([inline]))(title) || [[]];
  const el = document.createElement(<'h1'>`h${level}`);
  void el.appendChild(squash(children));
  return consumeBlockEndEmptyLine<HTMLHeadingElement, SubParsers>([el], source.slice(whole.length + 1));
};
