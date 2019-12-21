import { AutolinkParser } from '../../inline';
import { union, some, subline, validate, rewrite, convert, configure, lazy } from '../../../combinator';
import { unescsource } from '../../source';
import { link, bracket } from '../link';

const closer = /^[-+*~^,.;:!?]*(?=[\s"`|\[\](){}<>]|\\?(?:\s|$))/;

export const uri: AutolinkParser.UriParser = lazy(() => subline(validate(
  /^h?ttps?:\/\/[^/?#\s]/,
  configure({ syntax: { inline: { link: undefined } } },
  rewrite(
    some(union([bracket, some(unescsource, closer)])),
    convert(
      source => `{ ${address(source)}${attribute(source)} }`,
      union([link])))))));

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
