﻿import { Result } from '../../parser';
import { ParagraphParser, consumeBlockEndEmptyLine } from '../block';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { InlineParser, inline } from '../inline';
import { squash } from '../inline/text';

type SubParsers = [InlineParser];

const closer = /^\n\s*?\n/;

export const paragraph: ParagraphParser = function (source: string): Result<HTMLParagraphElement, SubParsers> {
  if (source.startsWith('\n') || source.match(closer)) return;
  const el = document.createElement('p');
  const [cs, rest] = loop(combine<SubParsers, HTMLElement | Text>([inline]), closer)(source.trim()) || [[document.createTextNode(source.trim())], ''];
  void el.appendChild(squash(cs));
  return consumeBlockEndEmptyLine<HTMLParagraphElement, SubParsers>([el], rest.slice(1));
}
