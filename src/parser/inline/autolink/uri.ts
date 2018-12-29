import { AutolinkParser } from '../../inline';
import { union, some, fmap, surround, verify, subline, focus, rewrite, convert, lazy } from '../../../combinator';
import { unescsource } from '../../source/unescapable';
import { link, bracket } from '../link';
import { defrag } from '../../util';
import { text } from 'typed-dom';

const closer = /^[-+*~^,.;:!?]*(?=[\s|\[\](){}<>]|\\?(?:\s|$))|^['"`]/;

export const uri: AutolinkParser.UriParser = subline(union([
  surround(
    /^(?=h?ttps?:\/\/\S)/,
    verify(rewrite(lazy(() =>
      some(union([ipv6, bracket, some(unescsource, closer)]))),
      convert(
        source => `[]{${address(source)}${attribute(source)}}`,
        link)),
      ([node]) => node instanceof HTMLAnchorElement),
    ''),
  surround(
    /^!(?=h?ttps?:\/\/\S)/,
    verify(rewrite(lazy(() =>
      some(union([ipv6, bracket, some(unescsource, closer)]))),
      convert(
        source => `[![]{${address(source)}}]{${address(source)}${attribute(source)}}`,
        link)),
      ([node]) => node instanceof HTMLAnchorElement),
    ''),
  focus(
    /^[0-9a-zA-Z!?][!?]*h?ttps?(?=:)/,
    defrag(some(unescsource))),
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
