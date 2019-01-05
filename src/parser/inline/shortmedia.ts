import { ShortmediaParser } from '../inline';
import { union, surround, subline, rewrite, convert } from '../../combinator';
import { link } from './link';
import { uri, address, attribute } from './autolink/uri';

export const shortmedia: ShortmediaParser = subline(union([
  surround(
    /^!(?=h?ttps?:\/\/[^/?#\s])/,
    rewrite(
      uri,
      convert(
        source => `[![]{${address(source)}}]{${address(source)}${attribute(source)}}`,
        link)),
    ''),
]));
