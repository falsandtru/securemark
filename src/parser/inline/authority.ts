import { AuthorityParser } from '../inline';
import { union, some, fmap, surround, verify, subline, lazy } from '../../combinator';
import { inline } from '../inline';
import { defrag, startsWithTightText, hasAnnotationOrAuthority, hasMedia } from '../util';
import { html } from 'typed-dom';

export const authority: AuthorityParser = subline(verify(
  fmap(lazy(() =>
    surround('[[', defrag(some(union([inline]), /^\n|^]]/)), ']]')),
    ns => [html('sup', { class: 'authority' }, ns)]),
  ([el]) => startsWithTightText(el) && !hasAnnotationOrAuthority(el) && !hasMedia(el)));
