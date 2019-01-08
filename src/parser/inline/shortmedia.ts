import { ShortmediaParser } from '../inline';
import { union, subline, rewrite, surround, convert } from '../../combinator';
import { uri, address, attribute } from './autolink/uri';
import { media } from './media';

export const shortmedia: ShortmediaParser = subline(union([
  surround(
    /^!(?=h?ttps?:\/\/[^/?#\s])/,
    rewrite(
      uri,
      convert(
        source => `!{${address(source)}${attribute(source)}}`,
        media)),
    ''),
]));
