import { StrongParser, inline } from '../inline';
import { combine, loop, bracket, transform } from '../../combinator';
import { squash } from '../squash';
import { match, isVisible } from '../source/validation';

const syntax = /^\*\*[\s\S]+?\*\*/;
const closer = /^\*\*/;

export const strong: StrongParser = source => {
  if (!match(source, '**', syntax)) return;
  return transform(
    bracket(
      '**',
      loop(combine<HTMLElement | Text, StrongParser.InnerParsers>([inline]), closer),
      '**'),
    (ns, rest) => {
      const el = document.createElement('strong');
      void el.appendChild(squash(ns));
      if (!isVisible(el.textContent!)) return;
      return [[el], rest];
    })
    (source);
};
