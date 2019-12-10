import { ShortmediaParser } from '../inline';
import { union, subline, rewrite, surround, convert } from '../../combinator';
import { uri, address, attribute } from './autolink/uri';
import { media } from './media';

export const shortmedia: ShortmediaParser = subline(
  rewrite(
    surround('!', uri, ''),
    convert(
      source => `!{ ${address(source.slice(1))}${attribute(source.slice(1))} }`,
      union([media]))));
