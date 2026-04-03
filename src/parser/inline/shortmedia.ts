import { ShortMediaParser } from '../inline';
import { State } from '../context';
import { union, constraint, scope, focus, rewrite, open, lazy } from '../../combinator';
import { url } from './autolink/url';
import { media } from './media';

export const shortmedia: ShortMediaParser = lazy(() => constraint(State.media, rewrite(
  open('!', url),
  scope(
    ({ source }) => `!{ ${source.slice(1)} }`,
    union([media]),
    true))));

export const lineshortmedia: ShortMediaParser.LineShortMediaParser = lazy(() => constraint(State.media, focus(
  /(?<=^|[\r\n])!https?:\/\/\S+(?=[^\S\r\n]*(?:$|\r?\n))/y,
  scope(
    ({ source }) => `!{ ${source.slice(1)} }`,
    union([media]),
    true))));
