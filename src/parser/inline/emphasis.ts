import { EmphasisParser, inline } from '../inline';
import { combine, some, bracket, transform } from '../../combinator';
import { strong } from './strong';
import { match } from '../source/validation';
import { isVisible } from './util/verification';
import { html } from 'typed-dom';

const syntax = /^\*[\s\S]+?\*/;
const closer = /^\*/;

export const emphasis: EmphasisParser = source => {
  if (!match(source, '*', syntax)) return;
  return transform(
    bracket(
      '*',
      some(combine<EmphasisParser>([some(inline, closer), strong])),
      '*'),
    (ns, rest) => {
      const el = html('em', ns);
      if (!isVisible(el)) return;
      return [[el], rest];
    })
    (source);
};
