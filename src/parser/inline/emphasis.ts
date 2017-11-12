import { Result } from '../../combinator/parser';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { EmphasisParser, StrongParser, InlineParser, inline } from '../inline';
import { strong } from './strong';
import { squash } from '../squash';

type SubParsers = [InlineParser, StrongParser];

const syntax = /^\*[\s\S]+?\*/;
const closer = /^\*/;

export const emphasis: EmphasisParser = function (source: string): Result<HTMLElement, SubParsers> {
  if (!source.startsWith('*') || source.search(syntax) !== 0) return;
  const [cs, rest] = loop(combine<SubParsers, HTMLElement | Text>([loop(inline, closer), strong]))(source.slice(1)) || [[], ''];
  if (!rest.startsWith('*')) return;
  const el = document.createElement('em');
  void el.appendChild(squash(cs));
  if (el.textContent!.trim() === '') return;
  return [[el], rest.slice(1)];
};
