import { AuthorityParser } from '../inblock';
import { union, some, fmap, surround, verify, subline, build } from '../../combinator';
import { autolink } from './autolink';
import { inline } from '../inline';
import { compress, startsWithTightText, hasMedia } from '../util';
import { html } from 'typed-dom';

export const authority: AuthorityParser = subline(verify(
  fmap(build(() =>
    surround('[[', compress(some(union([autolink, inline]), /^\n|^]]/)), ']]')),
    ns => [html('sup', { class: 'authority' }, ns)]),
  ([el]) => startsWithTightText(el) && !hasMedia(el)));
