import { AuthorityParser } from '../inline';
import { union, some, fmap, surround, verify, subline, build } from '../../combinator';
import { inblock } from '../inblock';
import { compress, startsWithTightText, hasAnnotationOrAuthority, hasMedia } from '../util';
import { html } from 'typed-dom';

export const authority: AuthorityParser = subline(verify(
  fmap(build(() =>
    surround('[[', compress(some(union([inblock]), /^\n|^]]/)), ']]')),
    ns => [html('sup', { class: 'authority' }, ns)]),
  ([el]) => startsWithTightText(el) && !hasAnnotationOrAuthority(el) && !hasMedia(el)));
