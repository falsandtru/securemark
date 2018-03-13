import { EmphasisParser, inline } from '../inline';
import { build, combine, some, surround, transform } from '../../combinator';
import { hasText } from './util/verification';
import { strong } from './strong';
import { squash } from '../util';
import { html } from 'typed-dom';

export const emphasis: EmphasisParser = transform(build(() =>
  surround('*', some(combine<EmphasisParser>([strong, some(inline, '*')])), '*')),
  (ns, rest) => {
    const el = html('em', squash(ns));
    return hasText(el)
      ? [[el], rest]
      : undefined;
  });
