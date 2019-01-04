import { AutolinkParser } from '../../inline';
import { union, some, surround, subline, focus, rewrite, convert } from '../../../combinator';
import { unescsource } from '../../source/unescapable';
import { link, bracket } from '../link';
import { defrag } from '../../util';

const closer = /^[-+*~^,.;:!?]*(?=[\s"`|\[\](){}<>]|\\?(?:\s|$))/;

export const uri: AutolinkParser.UriParser = subline(union([
  surround(
    /^(?=h?ttps?:\/\/[^/?#\s])/,
    rewrite(
      some(union([bracket, some(unescsource, closer)])),
      convert(
        source => `[]{${address(source)}${attribute(source)}}`,
        link)),
    ''),
  surround(
    /^!(?=h?ttps?:\/\/[^/?#\s])/,
    rewrite(
      some(union([bracket, some(unescsource, closer)])),
      convert(
        source => `[![]{${address(source)}}]{${address(source)}${attribute(source)}}`,
        link)),
    ''),
  focus(
    /^[0-9a-zA-Z!?][!?]*h?ttps?(?=:)/,
    defrag(some(unescsource))),
]));

function address(source: string): string {
  return source.startsWith('ttp')
    ? `h${source}`
    : source;
}

function attribute(source: string): string {
  return source.startsWith('ttp')
    ? ' nofollow'
    : '';
}
