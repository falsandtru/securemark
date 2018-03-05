import { StrongParser, inline } from '../inline';
import { combine, some, bracket, transform } from '../../combinator';
import { match, isVisible } from '../source/validation';
import { html } from 'typed-dom';

const syntax = /^\*\*[\s\S]+?\*\*/;
const closer = /^\*\*/;

export const strong: StrongParser = source => {
  if (!match(source, '**', syntax)) return;
  return transform(
    bracket(
      '**',
      some(combine<StrongParser>([inline]), closer),
      '**'),
    (ns, rest) => {
      const el = html('strong', ns);
      if (!isVisible(el.textContent!)) return;
      return [[el], rest];
    })
    (source);
};
