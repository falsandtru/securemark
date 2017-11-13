﻿import { StrongParser, inline } from '../inline';
import { combine, loop, bracket } from '../../combinator';
import { squash } from '../squash';
import { validate } from '../source/validation';

const syntax = /^\*\*[\s\S]+?\*\*/;
const closer = /^\*\*/;

export const strong: StrongParser = function (source: string): [[HTMLElement], string] | undefined {
  if (!validate(source, '**', syntax)) return;
  const [cs, rest] = bracket(
    '**',
    loop(combine<HTMLElement | Text, StrongParser.InnerParsers>([inline]), closer),
    '**',
  )(source) || [[], source];
  if (rest === source) return;
  const el = document.createElement('strong');
  void el.appendChild(squash(cs));
  if (el.textContent!.trim() === '') return;
  return [[el], rest];
};
