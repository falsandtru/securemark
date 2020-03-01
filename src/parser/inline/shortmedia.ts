import { ShortmediaParser } from '../inline';
import { union, rewrite, guard, open, convert } from '../../combinator';
import { url, address, attribute } from './autolink/url';
import { media } from './media';

export const shortmedia: ShortmediaParser = rewrite(
  guard(context => context.syntax?.inline?.media ?? true,
  open('!', url)),
  convert(
    source => `!{ ${address(source.slice(1))}${attribute(source.slice(1))} }`,
    union([media])));
