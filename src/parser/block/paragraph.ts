import { Result, combine, loop } from '../../combinator';
import { ParagraphParser } from '../block';
import { verifyBlockEnd } from './end';
import { InlineParser, inline } from '../inline';
import { squash } from '../squash';

type SubParsers = [InlineParser];

const closer = /^[^\S\n]*\\?(?=\n[^\S\n]*\\?\n|\n?$)/;

export const paragraph: ParagraphParser = verifyBlockEnd(function (source: string): Result<HTMLParagraphElement, SubParsers> {
  if (source.startsWith('\n')) return;
  source = source.replace(/^\s+/, '');
  const el = document.createElement('p');
  const [cs, rest] = loop(combine<SubParsers, HTMLElement | Text>([inline]), closer)(source) || [[document.createTextNode(source)], ''];
  void el.appendChild(squash(cs));
  return [[el], rest.slice(rest.split('\n').shift()!.length + 1)];
});
