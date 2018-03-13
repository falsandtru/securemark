import { StrongParser, inline } from '../inline';
import { build, combine, some, surround, transform } from '../../combinator';
import { hasText } from './util/verification';
import { squash } from '../squash';
import { html } from 'typed-dom';

export const strong: StrongParser = transform(build(() =>
  surround('**', some(combine<StrongParser>([inline]), '**'), '**')),
  (ns, rest) => {
    const el = html('strong', squash(ns));
    return hasText(el)
      ? [[el], rest]
      : undefined;
  });
