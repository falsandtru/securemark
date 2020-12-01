import { ShortmediaParser } from '../inline';
import { union, rewrite, guard, open, convert } from '../../combinator';
import { url } from './autolink/url';
import { media } from './media';

export const shortmedia: ShortmediaParser = rewrite(
  open(
    '!',
    guard(context => context.syntax?.inline?.media ?? true,
    url)),
  convert(
    source => `!{ ${source.slice(1)} }`,
    union([media])));
