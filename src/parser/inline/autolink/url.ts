import { AutolinkParser } from '../../inline';
import { union, some, rewrite, backtrack, convert, open_, update, lazy } from '../../../combinator';
import { unescsource, str } from '../../source';
import { link } from '../link';

const closer = /^[-+*~^,.;:!?]*(?=[\s"`|\[\](){}<>]|\\?(?:$|\s))/;

export const url: AutolinkParser.UrlParser = lazy(() => rewrite(
  open_(
    str(/^h?ttps?:\/\/(?=[^/?#\s])/),
    backtrack(some(union([bracket, some(unescsource, closer)])))),
  convert(
    source => `{ ${address(source)}${attribute(source)} }`,
    update({ syntax: { inline: { link: void 0 } } },
    union([link])))));

export const bracket: AutolinkParser.UrlParser.BracketParser = union([
  str(/^\([^\s\)]{0,100}\)/),
  str(/^\[[^\s\]]{0,100}\]/),
  str(/^\{[^\s\}]{0,100}\}/),
  str(/^\<[^\s\>]{0,100}\>/),
  str(/^\"[^\s\"]{0,100}\"/),
]);

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
