import { AutolinkParser } from '../../inline';
import { union, some, fmap, surround, verify, subline, focus, rewrite, build } from '../../../combinator';
import { unescsource } from '../../source/unescapable';
import { link, bracket } from '../link';
import { compress } from '../../util';
import { text } from 'typed-dom';

const closer = /^['"`|\[\](){}<>]|^[-+*~^,.;:!?]*(?=[\s|\[\](){}<>]|$)|^\\?(?:\s|$)/;

export const uri: AutolinkParser.UriParser = subline(union([
  focus(
    /^(?:[0-9a-zA-Z][!?]*h|\?h|[0-9a-gi-zA-Z!?])ttps?(?=:\/\/\S)/,
    compress(some(unescsource))),
  surround(
    /^(?=h?ttps?:\/\/\S)/,
    verify(rewrite(build(() =>
      some(union([ipv6, bracket, some(unescsource, closer)]))),
      source =>
        link(`[](${address(source)}${attribute(source)})`)),
      ([node]) => node instanceof HTMLAnchorElement),
    ''),
  surround(
    /^!(?=https?:\/\/\S)/,
    verify(rewrite(build(() =>
      verify(uri, ([node]) => node instanceof HTMLAnchorElement)),
      source =>
        link(`[![](${source})](${source})`)),
      ([node]) => node instanceof HTMLAnchorElement),
    ''),
]));

const ipv6 = subline(fmap(
  surround('[', focus(/^[:0-9a-z]+/, addr => [[text(addr)], '']), ']'),
  ts => [text('['), ...ts, text(']')]));

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
