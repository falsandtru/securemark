import { Result } from '../../parser';
import { QuoteParser, InlineParser, inline } from '../inline';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { squash } from './text';

type SubParsers = [InlineParser];

const syntax = /^"\S[\s\S]*?"/;
const closer = /^"/;

export const quote: QuoteParser = function (source: string): Result<HTMLQuoteElement, SubParsers> {
  if (!source.startsWith('"') || source.startsWith('""') || !source.match(syntax)) return;
  const [cs, rest] = loop(combine<SubParsers, HTMLElement | Text>([inline]), closer)(source.slice(1)) || [[], ''];
  if (!rest.startsWith('"')) return;
  const el = document.createElement('q');
  void el.appendChild(squash(cs));
  if (el.textContent && el.textContent!== el.textContent!.trim()) return;
  return [[el], rest.slice(1)];
};
