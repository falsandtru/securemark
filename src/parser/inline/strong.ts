import { StrongParser, inline } from '../inline';
import { combine, loop, bracket, transform } from '../../combinator';
import { squash } from '../squash';
import { validate } from '../source/validation';

const syntax = /^\*\*[\s\S]+?\*\*/;
const closer = /^\*\*/;

export const strong: StrongParser = (source: string) => {
  if (!validate(source, '**', syntax)) return;
  return transform(
    bracket(
      '**',
      loop(combine<HTMLElement | Text, StrongParser.InnerParsers>([inline]), closer),
      '**'),
    (ns, rest) => {
      const el = document.createElement('strong');
      void el.appendChild(squash(ns));
      if (el.textContent!.trim() === '') return;
      return [[el], rest];
    })
    (source);
};
