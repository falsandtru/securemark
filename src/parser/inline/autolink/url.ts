import { undefined } from 'spica/global';
import { AutolinkParser } from '../../inline';
import { union, some, validate, focus, rewrite, context, creator, convert, surround, open, lazy } from '../../../combinator';
import { link } from '../link';
import { unescsource } from '../../source';

const closer = /^[-+*~^,.;:!?]*(?=[\s"`|\[\](){}<>]|\\?(?:$|\s))/;

export const url: AutolinkParser.UrlParser = lazy(() => validate('http', rewrite(
  open(
    /^https?:\/\/(?=[\x00-\x7F])/,
    focus(/^(?:(?!\s)[\x00-\x7F])+/, some(union([bracket, some(unescsource, closer)])))),
  convert(
    url => `{ ${url} }`,
    context({ syntax: { inline: { link: undefined } } },
    union([link]))))));

const bracket: AutolinkParser.UrlParser.BracketParser = lazy(() => creator(union([
  surround('(', some(union([bracket, unescsource]), ')'), ')', true),
  surround('[', some(union([bracket, unescsource]), ']'), ']', true),
  surround('{', some(union([bracket, unescsource]), '}'), '}', true),
  surround('<', some(union([bracket, unescsource]), '>'), '>', true),
  surround('"', some(unescsource, '"'), '"', true),
])));
