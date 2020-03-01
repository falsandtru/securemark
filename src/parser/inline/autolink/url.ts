import { AutolinkParser } from '../../inline';
import { Parser, union, some, validate, rewrite, context, convert, surround, open, lazy } from '../../../combinator';
import { unescsource, str } from '../../source';
import { link } from '../link';

const closer = /^[-+*~^,.;:!?]*(?=[\s"`|\[\](){}<>]|\\?(?:$|\s))/;

export const url: AutolinkParser.UrlParser = lazy(() => rewrite(
  validate(['http', 'ttp'], open(
    str(/^h?ttps?:\/\/(?=[^/?#\s])/),
    some<Parser<string>>(union([bracket, some(unescsource, closer)])))),
  convert(
    source => `{ ${address(source)}${attribute(source)} }`,
    context({ syntax: { inline: { link: void 0 } } },
    union([link])))));

const bracket: AutolinkParser.UrlParser.BracketParser = lazy(() => union([
  surround('(', some(union([bracket, str(/^[^\s\)([{<"]+/)])), ')', true),
  surround('[', some(union([bracket, str(/^[^\s\]([{<"]+/)])), ']', true),
  surround('{', some(union([bracket, str(/^[^\s\}([{<"]+/)])), '}', true),
  surround('<', some(union([bracket, str(/^[^\s\>([{<"]+/)])), '>', true),
  surround('"', str(/^[\s"]+/), '"', true),
]));

export function address(source: string): string {
  return source.slice(0, 3) === 'ttp'
    ? `h${source}`
    : source;
}

export function attribute(source: string): string {
  return source.slice(0, 3) === 'ttp'
    ? ' nofollow'
    : '';
}
