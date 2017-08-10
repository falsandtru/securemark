import { Result } from '../../combinator/parser';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { ParagraphParser, verifyBlockEnd } from '../block';
import { InlineParser, inline } from '../inline';
import { squash } from '../text';

type SubParsers = [InlineParser];

const closer = /^[^\S\n]*\\?(?=\n[^\S\n]*\\?\n|\n?$)/;

export const paragraph: ParagraphParser = function (source: string): Result<HTMLParagraphElement, SubParsers> {
  if (source.startsWith('\n')) return;
  source = source.replace(/^\s+/, '');
  const el = document.createElement('p');
  const [cs, rest] = loop(combine<SubParsers, HTMLElement | Text>([inline]), closer)(source) || [[document.createTextNode(source)], ''];
  void el.appendChild(squash(cs));
  return verifyBlockEnd<HTMLParagraphElement, SubParsers>([el], rest.slice(rest.split('\n').shift()!.length + 1));
};
