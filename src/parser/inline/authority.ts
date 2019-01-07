import { AuthorityParser } from '../inline';
import { union, some, subline, verify, surround, lazy, fmap } from '../../combinator';
import { inline } from '../inline';
import { defrag, startsWithTightText, hasAnnotationOrAuthority, hasMedia } from '../util';
import { html } from 'typed-dom';

export const authority: AuthorityParser = lazy(() => subline(verify(fmap(
  surround('[[', defrag(some(union([inline]), /^\n|^]]/)), ']]'),
  ns => [html('sup', { class: 'authority' }, ns)]),
  ([el]) => startsWithTightText(el) && !hasAnnotationOrAuthority(el) && !hasMedia(el))));
