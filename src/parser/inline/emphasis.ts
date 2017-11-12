import { Result, combine, loop, bracket } from '../../combinator';
import { EmphasisParser, StrongParser, InlineParser, inline } from '../inline';
import { strong } from './strong';
import { squash } from '../squash';
import { validate } from '../source/validation';

type SubParsers = [InlineParser, StrongParser];

const syntax = /^\*[\s\S]+?\*/;
const closer = /^\*/;

export const emphasis: EmphasisParser = function (source: string): Result<HTMLElement, SubParsers> {
  if (!validate(source, '*', syntax)) return;
  const [cs, rest] = bracket('*', loop(combine<SubParsers, HTMLElement | Text>([loop(inline, closer), strong])), '*')(source) || [[], source];
  if (rest === source) return;
  const el = document.createElement('em');
  void el.appendChild(squash(cs));
  if (el.textContent!.trim() === '') return;
  return [[el], rest];
};
