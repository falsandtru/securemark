import { AnnotationParser, inline } from '../inline';
import { combine, some, surround, transform } from '../../combinator';
import { squash } from '../squash';
import { hasText } from './util/verification';
import { html } from 'typed-dom';

export const annotation: AnnotationParser = source =>
  transform(
    surround('((', some(combine<AnnotationParser>([inline]), '))'), '))'),
    (ns, rest) => {
      const el = html('sup', { class: 'annotation' }, squash(ns));
      if (!hasText(el)) return;
      if (el.querySelector('.annotation, .media')) return;
      return [[el], rest];
    })
    (source);
