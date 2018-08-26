import { AuthorityParser } from '../inblock';
import { union, some, fmap, surround, verify, build } from '../../combinator';
import { inline } from '../inline';
import { startsWithTightText, hasMedia } from '../util';
import { html } from 'typed-dom';

export const authority: AuthorityParser = verify(
  fmap(build(() =>
    surround('[[', some(union([inline]), ']]'), ']]')),
    ns => [html('sup', { class: 'authority' }, ns)]),
  ([el]) => startsWithTightText(el) && !hasMedia(el));
