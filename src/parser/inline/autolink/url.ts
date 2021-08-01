import { AutolinkParser } from '../../inline';
import { union, some, validate, focus, rewrite, context, creator, convert, surround, open, lazy } from '../../../combinator';
import { link } from '../link';
import { unescsource } from '../../source';

const closer = /^[-+*=~^,.;:!?]*(?=["`|\[\](){}<>]|\\?$)/;

export const url: AutolinkParser.UrlParser = lazy(() => validate(['http://', 'https://'], rewrite(
  open(
    /^https?:\/\/(?=[\x21-\x7E])/,
    focus(/^[\x21-\x7E]+/, some(union([bracket, some(unescsource, closer)])))),
  context({ syntax: { inline: { link: true } } },
  convert(
    url => `{ ${url} }`,
    union([link]))))));

const bracket: AutolinkParser.UrlParser.BracketParser = lazy(() => creator(union([
  surround('(', some(union([bracket, unescsource]), ')'), ')', true),
  surround('[', some(union([bracket, unescsource]), ']'), ']', true),
  surround('{', some(union([bracket, unescsource]), '}'), '}', true),
  surround('"', some(unescsource, '"'), '"', true),
])));
