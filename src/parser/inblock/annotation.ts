﻿import { AnnotationParser, inblock } from '../inblock';
import { union, some, fmap, surround, verify, build } from '../../combinator';
import { startsWithTightText, hasMedia, hasAnnotationOrAuthority } from '../util';
import { html } from 'typed-dom';

export const annotation: AnnotationParser = verify(
  fmap(build(() =>
    surround('((', some(union([inblock]), '))'), '))')),
    ns => [html('sup', { class: 'annotation' }, ns)]),
  ([el]) => startsWithTightText(el) && !hasMedia(el) && !hasAnnotationOrAuthority(el));
