import { undefined } from 'spica/global';
import { AutolinkParser } from '../../inline';
import { union, some, validate, focus, rewrite, context, creator, convert, surround, open, lazy } from '../../../combinator';
import { unescsource, str } from '../../source';
import { link } from '../link';

const closer = /^[-+*~^,.;:!?]*(?=[\s"`|\[\](){}<>]|\\?(?:$|\s))/;

export const url: AutolinkParser.UrlParser = lazy(() => rewrite(
  validate('http', open(
    str(/^https?:\/\/(?=[^/?#\s])/),
    focus(/^(?:(?!\s)[\x00-\x7F])+/, some(union([bracket, some(unescsource, closer)]))))),
  convert(
    url => `{ ${url} }`,
    context({ syntax: { inline: { link: undefined } } },
    union([link])))));

const bracket: AutolinkParser.UrlParser.BracketParser = lazy(() => creator(union([
  surround('(', some(union([bracket, unescsource]), ')'), ')', true),
  surround('[', some(union([bracket, unescsource]), ']'), ']', true),
  surround('{', some(union([bracket, unescsource]), '}'), '}', true),
  surround('<', some(union([bracket, unescsource]), '>'), '>', true),
  surround('"', some(unescsource, '"'), '"', true),
])));
