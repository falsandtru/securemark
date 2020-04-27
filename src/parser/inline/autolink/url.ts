import { AutolinkParser } from '../../inline';
import { union, some, validate, rewrite, context, creator, convert, surround, open, lazy } from '../../../combinator';
import { unescsource, str } from '../../source';
import { link } from '../link';

const closer = /^[-+*~^,.;:!?]*(?=[\s"`|\[\](){}<>]|\\?(?:$|\s))/;

export const url: AutolinkParser.UrlParser = lazy(() => rewrite(
  validate(['http', 'ttp'], open(
    str(/^h?ttps?:\/\/(?=[^/?#\s])/),
    some(union([bracket, some(unescsource, closer)])))),
  convert(
    url2link,
    context({ syntax: { inline: { link: void 0 } } },
    union([link])))));

const bracket: AutolinkParser.UrlParser.BracketParser = lazy(() => creator(union([
  surround('"', some(unescsource, /^[\s"]+/), '"', true),
  surround('(', some(union([bracket, unescsource]), /^[\s\)]/), ')', true),
  surround('[', some(union([bracket, unescsource]), /^[\s\]]/), ']', true),
  surround('{', some(union([bracket, unescsource]), /^[\s\}]/), '}', true),
  surround('<', some(union([bracket, unescsource]), /^[\s\>]/), '>', true),
])));

export function url2link(url: string): string {
  assert(url.match(/^h?ttps?:/));
  return url[0] === 'h'
    ? `{ ${url} }`
    : `{ h${url} nofollow }`;
}
