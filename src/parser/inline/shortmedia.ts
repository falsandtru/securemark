import { ShortMediaParser } from '../inline';
import { State } from '../context';
import { union, constraint, focus, rewrite, open, convert } from '../../combinator';
import { url } from './autolink/url';
import { media } from './media';
import { linebreak } from '../source';

export const shortmedia: ShortMediaParser = constraint(State.media, rewrite(
  open('!', url),
  convert(
    source => `!{ ${source.slice(1)} }`,
    union([media]),
    false)));

export const lineshortmedia: ShortMediaParser.LineShortMediaParser = open(
  linebreak,
  focus(
    /!https?:\/\/\S+(?=[^\S\n]*(?:$|\n))/y,
    convert(
      source => `!{ ${source.slice(1)} }`,
      union([media]),
      false)));
