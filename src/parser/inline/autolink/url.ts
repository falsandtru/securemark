import { undefined } from 'spica/global';
import { AutolinkParser } from '../../inline';
import { union, some, validate, focus, rewrite, context, creator, convert, surround, open, lazy } from '../../../combinator';
import { unescsource, str } from '../../source';
import { link } from '../link';

const closer = /^[-+*~^,.;:!?]*(?=[\s"`|\[\](){}<>]|\\?(?:$|\s))/;

export const url: AutolinkParser.UrlParser = lazy(() => rewrite(
  validate(['http', 'ttp'], open(
    str(/^h?ttps?:\/\/(?=[^/?#\s])/),
    focus(/^(?:(?!\s)[\x00-\x7F])+/, some(union([bracket, some(unescsource, closer)]))))),
  convert(
    url2link,
    context({ syntax: { inline: { link: undefined } } },
    union([link])))));

const bracket: AutolinkParser.UrlParser.BracketParser = lazy(() => creator(union([
  surround('"', some(unescsource, '"'), '"', true),
  surround('(', some(union([bracket, unescsource]), ')'), ')', true),
  surround('[', some(union([bracket, unescsource]), ']'), ']', true),
  surround('{', some(union([bracket, unescsource]), '}'), '}', true),
  surround('<', some(union([bracket, unescsource]), '>'), '>', true),
])));

export function url2link(url: string): string {
  assert(url.match(/^h?ttps?:\S+$/));
  return url[0] === 'h'
    ? `{ ${url} }`
    : `{ h${url} nofollow }`;
}
