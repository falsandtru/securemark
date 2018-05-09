import { AnnotationParser, inline } from '../inline';
import { union, some, surround, verify, fmap, build } from '../../combinator';
import { hasText, hasMedia, hasAnnotation } from '../util';
import { html } from 'typed-dom';

export const annotation: AnnotationParser = verify(fmap(build(() =>
  surround('((', some(union([inline]), '))'), '))')),
  ns => {
    const el = html('sup', { class: 'annotation' }, ns);
    return [el];
  }
), ([el]) => hasText(el) && !hasMedia(el) && !hasAnnotation(el));
