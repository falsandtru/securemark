import { Result } from '../../parser';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { ParagraphParser, consumeBlockEndEmptyLine } from '../block';
import { InlineParser, inline } from '../inline';
import { squash } from '../text';

type SubParsers = [InlineParser];

const closer = /^\n\s*?\n/;

export const paragraph: ParagraphParser = function (source: string): Result<HTMLParagraphElement, SubParsers> {
  if (source.startsWith('\n') || source.search(closer) === 0) return;
  const el = document.createElement('p');
  const [cs, rest] = loop(combine<SubParsers, HTMLElement | Text>([inline]), closer)(source.trim()) || [[document.createTextNode(source.trim())], ''];
  void el.appendChild(squash(cs));
  return consumeBlockEndEmptyLine<HTMLParagraphElement, SubParsers>([el], rest.slice(1));
};
