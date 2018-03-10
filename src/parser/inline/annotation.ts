import { AnnotationParser, inline } from '../inline';
import { combine, some, bracket, transform } from '../../combinator';
import { match } from '../source/validation';
import { isVisible } from './util/verification';
import { html } from 'typed-dom';

const syntax = /^\(\([\s\S]+?\)\)/;
const closer = /^\)\)/;

export const annotation: AnnotationParser = source => {
  if (!match(source, '((', syntax)) return;
  return transform(
    bracket(
      '((',
      some(combine<AnnotationParser>([inline]), closer),
      '))'),
    (ns, rest) => {
      const el = html('sup', { class: 'annotation' }, ns);
      if (!isVisible(el)) return;
      if (el.querySelector('.annotation, .media')) return;
      return [[el], rest];
    })
    (source);
};
