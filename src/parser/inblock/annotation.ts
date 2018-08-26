import { AnnotationParser } from '../inblock';
import { union, some, fmap, surround, verify, build } from '../../combinator';
import { inline } from '../inline';
import { startsWithTightText, hasMedia } from '../util';
import { html } from 'typed-dom';

export const annotation: AnnotationParser = verify(
  fmap(build(() =>
    surround('((', some(union([inline]), '))'), '))')),
    ns => [html('sup', { class: 'annotation' }, ns)]),
  ([el]) => startsWithTightText(el) && !hasMedia(el));
