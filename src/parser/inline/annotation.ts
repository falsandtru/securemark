﻿import { AnnotationParser, inline } from '../inline';
import { union, some, surround, bind, build } from '../../combinator';
import { hasText, hasMedia, hasAnnotation } from '../util';
import { html } from 'typed-dom';

export const annotation: AnnotationParser = bind(build(() =>
  surround('((', some(union([inline]), '))'), '))')),
  (ns, rest) => {
    const el = html('sup', { class: 'annotation' }, ns);
    return hasText(el) && !hasMedia(el) && !hasAnnotation(el)
      ? [[el], rest]
      : undefined;
  });
