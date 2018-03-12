import { EmphasisParser, inline } from '../inline';
import { combine, some, surround, transform } from '../../combinator';
import { strong } from './strong';
import { squash } from '../squash';
import { hasText } from './util/verification';
import { html } from 'typed-dom';

export const emphasis: EmphasisParser = source =>
  transform(
    surround('*', some(combine<EmphasisParser>([some(inline, '*'), strong])), '*'),
    (ns, rest) => {
      const el = html('em', squash(ns));
      if (!hasText(el)) return;
      return [[el], rest];
    })
    (source);
