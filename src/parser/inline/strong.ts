import { StrongParser, inline } from '../inline';
import { combine, some, surround, transform } from '../../combinator';
import { isVisible } from './util/verification';
import { html } from 'typed-dom';

const closer = /^\*\*/;

export const strong: StrongParser = source =>
  transform(
    surround(
      '**',
      some(combine<StrongParser>([inline]), closer),
      '**'),
    (ns, rest) => {
      const el = html('strong', ns);
      if (!isVisible(el)) return;
      return [[el], rest];
    })
    (source);
