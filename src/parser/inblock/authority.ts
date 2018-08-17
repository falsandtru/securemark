import { AuthorityParser, inblock } from '../inblock';
import { union, some, fmap, surround, verify, build } from '../../combinator';
import { hasTightStartText, hasMedia, hasAnnotationOrAuthority } from '../util';
import { html } from 'typed-dom';

export const authority: AuthorityParser = verify(fmap(build(() =>
  surround('[[', some(union([inblock]), ']]'), ']]')),
  ns => [html('sup', { class: 'authority' }, ns)]
), ([el]) => hasTightStartText(el) && !hasMedia(el) && !hasAnnotationOrAuthority(el));
