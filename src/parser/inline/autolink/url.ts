import { AutolinkParser } from '../../inline';
import { union, tails, some, creation, precedence, validate, focus, rewrite, convert, surround, open, lazy } from '../../../combinator';
import { unsafelink } from '../link';
import { linebreak, unescsource, str } from '../../source';
import { Recursion } from '../../context';

const closer = /^[-+*=~^_,.;:!?]*(?=[\\"`|\[\](){}<>]|$)/;

export const url: AutolinkParser.UrlParser = lazy(() => validate(['http://', 'https://'], rewrite(
  open(
    /^https?:\/\/(?=[\x21-\x7E])/,
    focus(/^[\x21-\x7E]+/, some(union([bracket, some(unescsource, closer)])))),
  convert(
    url => `{ ${url} }`,
    union([unsafelink])))));

export const lineurl: AutolinkParser.UrlParser.LineUrlParser = lazy(() => open(
  linebreak,
  tails([
    str('!'),
    focus(
      /^https?:\/\/\S+(?=[^\S\n]*(?:$|\n))/,
      convert(
        url => `{ ${url} }`,
        unsafelink)),
  ])));

const bracket: AutolinkParser.UrlParser.BracketParser = lazy(() => creation(0, Recursion.terminal, precedence(2, union([
  surround(str('('), some(union([bracket, unescsource]), ')'), str(')'), true),
  surround(str('['), some(union([bracket, unescsource]), ']'), str(']'), true),
  surround(str('{'), some(union([bracket, unescsource]), '}'), str('}'), true),
  surround(str('"'), precedence(3, some(unescsource, '"')), str('"'), true),
]))));
