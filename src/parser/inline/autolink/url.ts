import { undefined } from 'spica/global';
import { AutolinkParser } from '../../inline';
import { union, some, validate, focus, rewrite, context, creator, convert, surround, open, lazy } from '../../../combinator';
import { link } from '../link';
import { unescsource } from '../../source';

const closer = /^[-+*=~^,.;:!?]*(?=["`|\[\](){}<>]|\\?$)/;

export const url: AutolinkParser.UrlParser = lazy(() => validate('http', '://', '\n', rewrite(
  open(
    /^https?:\/\/(?=[\x21-\x7E])/,
    focus(/^[\x21-\x7E]+/, some(union([bracket, some(unescsource, closer)])))),
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
