import { AnnotationParser } from '../inline';
import { union, some, fmap, surround, verify, build } from '../../combinator';
import { inblock } from '../inblock';
import { compress, startsWithTightText, hasAnnotationOrAuthority, hasMedia } from '../util';
import { html } from 'typed-dom';

export const annotation: AnnotationParser = verify(
  fmap(build(() =>
    surround('((', compress(some(union([inblock]), '))')), '))')),
    ns => [html('sup', { class: 'annotation' }, ns)]),
  ([el]) => startsWithTightText(el) && !hasAnnotationOrAuthority(el) && !hasMedia(el));
