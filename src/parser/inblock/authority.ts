import { AuthorityParser, inblock } from '../inblock';
import { union, some, fmap, surround, verify, build } from '../../combinator';
import { hasText, hasMedia, hasAnnotationOrAuthority } from '../util';
import { html } from 'typed-dom';

export const authority: AuthorityParser = verify(fmap(build(() =>
  surround('[[', some(union([inblock]), ']]'), ']]')),
  ns => [html('sup', { class: 'authority' }, ns)]
), ([el]) => hasText(el) && !hasMedia(el) && !hasAnnotationOrAuthority(el));
