import { EmphasisParser, inline } from '../inline';
import { combine, loop, bracket } from '../../combinator';
import { strong } from './strong';
import { squash } from '../squash';
import { validate } from '../source/validation';

const syntax = /^\*[\s\S]+?\*/;
const closer = /^\*/;

export const emphasis: EmphasisParser = function (source: string): [[HTMLElement], string] | undefined {
  if (!validate(source, '*', syntax)) return;
  const [cs, rest] = bracket('*', loop(combine<HTMLElement | Text, EmphasisParser.InnerParsers>([loop(inline, closer), strong])), '*')(source) || [[], source];
  if (rest === source) return;
  const el = document.createElement('em');
  void el.appendChild(squash(cs));
  if (el.textContent!.trim() === '') return;
  return [[el], rest];
};
