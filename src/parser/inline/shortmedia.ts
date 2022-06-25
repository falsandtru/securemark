import { ShortmediaParser } from '../inline';
import { union, guard, rewrite, open, convert } from '../../combinator';
import { url } from './autolink/url';
import { media } from './media';
import { State } from '../context';

export const shortmedia: ShortmediaParser = rewrite(
  guard(context => ~context.state! & State.media,
  open('!', url)),
  convert(
    source => `!{ ${source.slice(1)} }`,
    union([media])));
