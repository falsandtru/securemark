import { AnnotationParser, inline } from '../inline';
import { combine, some, surround, transform } from '../../combinator';
import { squash } from '../squash';
import { isVisible } from './util/verification';
import { html } from 'typed-dom';

const closer = /^\)\)/;

export const annotation: AnnotationParser = source =>
  transform(
    surround(
      '((',
      some(combine<AnnotationParser>([inline]), closer),
      '))'),
    (ns, rest) => {
      const el = html('sup', { class: 'annotation' }, squash(ns));
      if (!isVisible(el)) return;
      if (el.querySelector('.annotation, .media')) return;
      return [[el], rest];
    })
    (source);
