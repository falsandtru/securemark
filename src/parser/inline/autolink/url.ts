import { AutolinkParser } from '../../inline';
import { union, some, match, surround, verify, rewrite, build } from '../../../combinator';
import { line } from '../../source/line';
import { escsource } from '../../source/escapable';
import { link, ipv6, parenthesis } from '../link';
import { text } from 'typed-dom';

const closer = /^['"`|\[\](){}<>]|^[-+*~^,.;:!?]*(?=[\s|\[\](){}<>]|$)|^\\?(?:\n|$)/;

export const url: AutolinkParser.UrlParser = line(union([
  match(
    /^(?:[0-9a-zA-Z][!?]*h|\?h|[0-9a-gi-zA-Z!?])ttps?(?=:\/\/\S)/,
    ([frag], rest) =>
      [[text(frag)], rest]),
  surround(
    /^(?=h?ttps?:\/\/\S)/,
    verify(rewrite(
      some(union([ipv6, parenthesis, some(escsource, closer)])),
      source =>
        link(`[](${address(source)}${attribute(source)})`)),
      ([node]) => node instanceof HTMLAnchorElement),
    ''),
  surround(
    /^!(?=https?:\/\/\S)/,
    verify(rewrite(build(() =>
      verify(url, ([node]) => node instanceof HTMLAnchorElement)),
      source =>
        link(`[![](${source})](${source})`)),
      ([node]) => node instanceof HTMLAnchorElement),
    ''),
]), false);

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
