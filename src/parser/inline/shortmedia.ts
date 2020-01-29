import { ShortmediaParser } from '../inline';
import { union, subline, rewrite, surround, convert } from '../../combinator';
import { url, address, attribute } from './autolink/url';
import { media } from './media';

export const shortmedia: ShortmediaParser = subline(
  rewrite(
    surround('!', url, ''),
    convert(
      source => `!{ ${address(source.slice(1))}${attribute(source.slice(1))} }`,
      union([media]))));
