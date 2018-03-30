import { AnnotationParser, inline } from '../inline';
import { union, some, surround, transform, build } from '../../combinator';
import { hasText } from '../util';
import { html } from 'typed-dom';

export const annotation: AnnotationParser = transform(build(() =>
  surround('((', some(union<AnnotationParser>([inline]), '))'), '))')),
  (ns, rest) => {
    const el = html('sup', { class: 'annotation' }, ns);
    return hasText(el) && !el.querySelector('.annotation, .media')
      ? [[el], rest]
      : undefined;
  });
