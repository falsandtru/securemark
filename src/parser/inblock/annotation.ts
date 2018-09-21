import { AnnotationParser } from '../inblock';
import { union, some, fmap, surround, verify, build } from '../../combinator';
import { autolink } from './autolink';
import { inline } from '../inline';
import { compress, startsWithTightText, hasMedia } from '../util';
import { html } from 'typed-dom';

export const annotation: AnnotationParser = verify(
  fmap(build(() =>
    surround('((', compress(some(union([autolink, inline]), '))')), '))')),
    ns => [html('sup', { class: 'annotation' }, ns)]),
  ([el]) => startsWithTightText(el) && !hasMedia(el));
