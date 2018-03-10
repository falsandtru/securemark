import { EmphasisParser, inline } from '../inline';
import { combine, some, surround, transform } from '../../combinator';
import { strong } from './strong';
import { isVisible } from './util/verification';
import { html } from 'typed-dom';

const closer = /^\*/;

export const emphasis: EmphasisParser = source =>
  transform(
    surround(
      '*',
      some(combine<EmphasisParser>([some(inline, closer), strong])),
      '*'),
    (ns, rest) => {
      const el = html('em', ns);
      if (!isVisible(el)) return;
      return [[el], rest];
    })
    (source);
