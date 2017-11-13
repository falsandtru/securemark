import { EmphasisParser, inline } from '../inline';
import { combine, loop, bracket, transform } from '../../combinator';
import { strong } from './strong';
import { squash } from '../squash';
import { validate } from '../source/validation';

const syntax = /^\*[\s\S]+?\*/;
const closer = /^\*/;

export const emphasis: EmphasisParser = function (source: string) {
  if (!validate(source, '*', syntax)) return;
  return transform(
    bracket(
      '*',
      loop(combine<HTMLElement | Text, EmphasisParser.InnerParsers>([loop(inline, closer), strong])),
      '*'),
    (ns, rest) => {
      const el = document.createElement('em');
      void el.appendChild(squash(ns));
      if (el.textContent!.trim() === '') return;
      return [[el], rest];
    })
    (source);
};
