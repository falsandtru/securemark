import { AnnotationParser } from '../inline';
import { union, some, verify, surround, lazy, fmap } from '../../combinator';
import { inline } from '../inline';
import { defrag, trimNodeEnd, hasTightText, hasMedia, hasAnnotationOrAuthority } from '../util';
import { html } from 'typed-dom';

export const annotation: AnnotationParser = lazy(() => verify(fmap(trimNodeEnd(
  surround(/^\n?\(\((?:[^\S\n]*\n)?/, defrag(some(union([inline]), /^\n?\)\)/)), /^\n?\)\)/)),
  ns => [html('sup', { class: 'annotation' }, ns)]),
  ([el]) => hasTightText(el) && !hasMedia(el) && !hasAnnotationOrAuthority(el)));
