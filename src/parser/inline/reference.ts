import { ReferenceParser } from '../inline';
import { union, some, subline, verify, surround, lazy, fmap } from '../../combinator';
import { inline } from '../inline';
import { defrag, trimNodeEnd, hasTightText, hasMedia, hasAnnotationOrReference } from '../util';
import { html } from 'typed-dom';

export const reference: ReferenceParser = lazy(() => subline(verify(fmap(trimNodeEnd(
  surround('[[', defrag(some(union([inline]), /^\\?\n|^]]/)), ']]')),
  ns => [html('sup', { class: 'reference' }, ns)]),
  ([el]) => hasTightText(el) && !hasMedia(el) && !hasAnnotationOrReference(el))));
