﻿import { BraceParser, inline } from '../inline';
import { combine, loop, bracket } from '../../combinator';
import { squash } from '../squash';
import { validate } from '../source/validation';

const syntax = /^{[\s\S]*?}/;
const closer = /^}/;

export const brace: BraceParser = function (source: string): [(HTMLElement | Text)[], string] | undefined {
  if (!validate(source, '{', syntax)) return;
  const [cs, rest] = bracket('{', loop(combine<HTMLElement | Text, BraceParser.InnerParsers>([inline]), closer), '}')(source) || [[], source];
  if (rest === source) return;
  return [[...squash([document.createTextNode('{'), ...cs, document.createTextNode('}')]).childNodes] as Array<HTMLElement | Text>, rest];
};
