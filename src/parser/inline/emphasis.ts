import { EmphasisParser, inline } from '../inline';
import { combine, loop, bracket, transform } from '../../combinator';
import { strong } from './strong';
import { match, isVisible } from '../source/validation';
import { html } from 'typed-dom';

const syntax = /^\*[\s\S]+?\*/;
const closer = /^\*/;

export const emphasis: EmphasisParser = source => {
  if (!match(source, '*', syntax)) return;
  return transform(
    bracket(
      '*',
      loop(combine<HTMLElement | Text, EmphasisParser.InnerParsers>([loop(inline, closer), strong])),
      '*'),
    (ns, rest) => {
      const el = html('em', ns);
      if (!isVisible(el.textContent!)) return;
      return [[el], rest];
    })
    (source);
};
