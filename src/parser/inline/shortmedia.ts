import { ShortmediaParser } from '../inline';
import { union, subline, rewrite, surround, convert } from '../../combinator';
import { uri, address, attribute } from './autolink/uri';
import { media } from './media';

export const shortmedia: ShortmediaParser = subline(
  surround(
    '!',
    rewrite(
      uri,
      convert(
        source => `!{${address(source)}${attribute(source)}}`,
        union([media]))),
    ''));
