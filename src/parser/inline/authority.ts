import { AuthorityParser } from '../inline';
import { union, some, subline, verify, surround, lazy, fmap } from '../../combinator';
import { inline } from '../inline';
import { defrag, trimEdgeEnd, hasTightText, hasMedia, hasAnnotationOrAuthority } from '../util';
import { html } from 'typed-dom';

export const authority: AuthorityParser = lazy(() => subline(verify(fmap(trimEdgeEnd(
  surround('[[', defrag(some(union([inline]), /^\n|^]]/)), ']]')),
  ns => [html('sup', { class: 'authority' }, ns)]),
  ([el]) => hasTightText(el) && !hasMedia(el) && !hasAnnotationOrAuthority(el))));
