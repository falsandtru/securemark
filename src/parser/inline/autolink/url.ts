import { AutolinkParser } from '../../inline';
import { union, some, validate, focus, rewrite, precedence, creator, convert, surround, open, lazy } from '../../../combinator';
import { textlink } from '../link';
import { unescsource } from '../../source';

const closer = /^[-+*=~^,.;:!?]*(?=[\\"`|\[\](){}<>]|$)/;

export const url: AutolinkParser.UrlParser = lazy(() => validate(['http://', 'https://'], rewrite(
  open(
    /^https?:\/\/(?=[\x21-\x7E])/,
    focus(/^[\x21-\x7E]+/, some(union([bracket, some(unescsource, closer)])))),
  convert(
    url => `{ ${url} }`,
    union([textlink])))));

const bracket: AutolinkParser.UrlParser.BracketParser = lazy(() => creator(precedence(3, union([
  surround('(', some(union([bracket, unescsource]), ')'), ')', true),
  surround('[', some(union([bracket, unescsource]), ']'), ']', true),
  surround('{', some(union([bracket, unescsource]), '}'), '}', true),
  surround('"', precedence(8, some(unescsource, '"')), '"', true),
]))));
