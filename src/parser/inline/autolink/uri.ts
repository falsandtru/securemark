import { AutolinkParser } from '../../inline';
import { union, some, subline, rewrite, surround, convert } from '../../../combinator';
import { unescsource } from '../../source/unescapable';
import { link, bracket } from '../link';

const closer = /^[-+*~^,.;:!?]*(?=[\s"`|\[\](){}<>]|\\?(?:\s|$))/;

export const uri: AutolinkParser.UriParser = subline(union([
  surround(
    /^(?=h?ttps?:\/\/[^/?#\s])/,
    rewrite(
      some(union([bracket, some(unescsource, closer)])),
      convert(
        source => `{${address(source)}${attribute(source)}}`,
        link)),
    ''),
]));

export function address(source: string): string {
  return source.startsWith('ttp')
    ? `h${source}`
    : source;
}

export function attribute(source: string): string {
  return source.startsWith('ttp')
    ? ' nofollow'
    : '';
}
