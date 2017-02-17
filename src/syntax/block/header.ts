import { Result } from '../../parser.d';
import { HeaderParser, consumeBlockEndEmptyLine } from '../block';
import { compose } from '../../parser/compose';
import { loop } from '../../parser/loop';
import { InlineParser, inline } from '../inline';
import { squash } from '../inline/text';

type SubParsers = [InlineParser];

const syntax = /^(#{1,6})\s+?([^\n]+)/;

export const header: HeaderParser = function (source: string): Result<HTMLHeadingElement, SubParsers> {
  const [whole, {length: level}, title] = source.match(syntax) || ['', '', ''];
  if (!whole) return;
  assert(level > 0 && level < 7);
  assert(title.length > 0);
  const [children] = loop(compose<SubParsers, HTMLElement | Text>([inline]))(title) || [[], ''];
  const el = document.createElement(<'h1'>`h${level}`);
  void el.appendChild(squash(children));
  return consumeBlockEndEmptyLine<HTMLHeadingElement, SubParsers>([el], source.slice(whole.length + 1));
}
