import { Result, combine, loop, bracket } from '../../combinator';
import { StrongParser, InlineParser, inline } from '../inline';
import { squash } from '../squash';

type SubParsers = [InlineParser];

const syntax = /^\*\*[\s\S]+?\*\*/;
const closer = /^\*\*/;

export const strong: StrongParser = function (source: string): Result<HTMLElement, SubParsers> {
  if (!source.startsWith('**') || source.search(syntax) !== 0) return;
  const [cs, rest] = bracket('**', loop(combine<SubParsers, HTMLElement | Text>([inline]), closer), '**')(source) || [[], source];
  if (rest === source) return;
  const el = document.createElement('strong');
  void el.appendChild(squash(cs));
  if (el.textContent!.trim() === '') return;
  return [[el], rest];
};
