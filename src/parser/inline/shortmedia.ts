import { ShortMediaParser } from '../inline';
import { union, constraint, focus, rewrite, open, convert } from '../../combinator';
import { url } from './autolink/url';
import { media } from './media';
import { linebreak } from '../source';
import { State } from '../context';

export const shortmedia: ShortMediaParser = rewrite(
  constraint(State.media, false,
  open('!', url)),
  convert(
    source => `!{ ${source.slice(1)} }`,
    union([media])));

export const lineshortmedia: ShortMediaParser.LineShortMediaParser = open(
  linebreak,
  focus(
    /^!https?:\/\/\S+(?=[^\S\n]*(?:$|\n))/,
    convert(
      source => `!{ ${source.slice(1)} }`,
      union([media]))));
