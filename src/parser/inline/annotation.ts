import { AnnotationParser } from '../inline';
import { union, some, fmap, surround, verify, lazy } from '../../combinator';
import { inline } from '../inline';
import { defrag, startsWithTightText, hasAnnotationOrAuthority, hasMedia } from '../util';
import { html } from 'typed-dom';

export const annotation: AnnotationParser = verify(
  fmap(lazy(() =>
    surround('((', defrag(some(union([inline]), '))')), '))')),
    ns => [html('sup', { class: 'annotation' }, ns)]),
  ([el]) => startsWithTightText(el) && !hasAnnotationOrAuthority(el) && !hasMedia(el));
