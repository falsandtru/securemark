import { AnnotationParser, inline } from '../inline';
import { build, combine, some, surround, transform } from '../../combinator';
import { hasText } from './util/verification';
import { squash } from '../squash';
import { html } from 'typed-dom';

export const annotation: AnnotationParser = transform(build(() =>
  surround('((', some(combine<AnnotationParser>([inline]), '))'), '))')),
  (ns, rest) => {
    const el = html('sup', { class: 'annotation' }, squash(ns));
    return hasText(el) && !el.querySelector('.annotation, .media')
      ? [[el], rest]
      : undefined;
  });
