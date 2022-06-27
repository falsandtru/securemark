import { ShortmediaParser } from '../inline';
import { union, constraint, rewrite, open, convert } from '../../combinator';
import { url } from './autolink/url';
import { media } from './media';
import { State } from '../context';

export const shortmedia: ShortmediaParser = rewrite(
  constraint(State.media, false,
  open('!', url)),
  convert(
    source => `!{ ${source.slice(1)} }`,
    union([media])));
