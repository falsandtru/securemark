﻿import { Result } from '../../parser';
import { EmphasisParser, InlineParser, inline, squash } from '../inline';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';

type SubParsers = [InlineParser];

const syntax = /^\*[\s\S]+?\*/;
const closer = /^\*/;

export const emphasis: EmphasisParser = function (source: string): Result<HTMLElement, SubParsers> {
  if (!source.startsWith('*') || source.search(syntax) !== 0) return;
  const [cs, rest] = loop(combine<SubParsers, HTMLElement | Text>([inline]), closer)(source.slice(1)) || [[], ''];
  if (!rest.startsWith('*')) return;
  const el = document.createElement('em');
  void el.appendChild(squash(cs));
  if (el.textContent!.trim() === '') return;
  return [[el], rest.slice(1)];
};
