import { AuthorityParser } from '../inline';
import { union, some, subline, verify, surround, lazy, fmap } from '../../combinator';
import { inline } from '../inline';
import { defrag, trimNodeEnd, hasTightText, hasMedia, hasAnnotationOrAuthority } from '../util';
import { html } from 'typed-dom';

export const authority: AuthorityParser = lazy(() => subline(verify(fmap(trimNodeEnd(
  surround('[[', defrag(some(union([inline]), /^\n|^]]/)), ']]')),
  ns => [html('sup', { class: 'authority' }, ns)]),
  ([el]) => hasTightText(el) && !hasMedia(el) && !hasAnnotationOrAuthority(el))));
