import { Result } from '../../parser';
import { ParagraphParser, consumeBlockEndEmptyLine } from '../block';
import { compose } from '../../combinator/compose';
import { loop } from '../../combinator/loop';
import { InlineParser, inline } from '../inline';
import { squash } from '../inline/text';

type SubParsers = [InlineParser];

const closer = /^\n\s*?\n/;

export const paragraph: ParagraphParser = function (source: string): Result<HTMLParagraphElement, SubParsers> {
  if (source.startsWith('\n') || source.match(closer)) return;
  const el = document.createElement('p');
  const [cs, rest] = loop(compose<SubParsers, HTMLElement | Text>([inline]), closer)(source.trim()) || [[], ''];
  void el.appendChild(squash(cs));
  return el.childNodes.length === 0
    ? void 0
    : consumeBlockEndEmptyLine<HTMLParagraphElement, SubParsers>([el], rest.slice(1));
}
