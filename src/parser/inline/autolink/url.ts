import { AutolinkParser } from '../../inline';
import { State, Recursion, Backtrack } from '../../context';
import { union, tails, some, recursion, precedence, state, constraint, verify, focus, rewrite, convert, surround, open, lazy } from '../../../combinator';
import { unsafelink } from '../link';
import { unescsource, str } from '../../source';

export const url: AutolinkParser.UrlParser = lazy(() => rewrite(
  open(
    /(?<![0-9a-z][.+-]?)https?:\/\/(?=[\x21-\x7E])/y,
    precedence(1, some(union([
      verify(bracket, ns => ns.length > 0),
      some(unescsource, /([-+*=~^_/])\1|[,.;:!?]{2}|[-+*=~^_,.;:!?]?(?=[\\"`\[\](){}<>（）［］｛｝|]|[^\x21-\x7E]|$)/y),
    ]), undefined, [[/[^\x21-\x7E]|\$/y, 9]])),
    false,
    [3 | Backtrack.autolink]),
  union([
    constraint(State.autolink, state(State.autolink, convert(
      url => `{ ${url} }`,
      unsafelink,
      false))),
    ({ context: { source } }) => [[source]],
  ])));

export const lineurl: AutolinkParser.UrlParser.LineUrlParser = lazy(() => focus(
  /(?<=^|[\r\n])!?https?:\/\/\S+(?=[^\S\n]*(?=$|\n))/y,
  tails([
    str('!'),
    union([
      constraint(State.autolink, state(State.autolink, convert(
        url => `{ ${url} }`,
        unsafelink,
        false))),
      ({ context: { source } }) => [[source]],
    ]),
  ])));

const bracket: AutolinkParser.UrlParser.BracketParser = lazy(() => union([
  surround(str('('), recursion(Recursion.terminal, some(union([bracket, unescsource]), ')')), str(')'), true,
    undefined, () => [[]], [3 | Backtrack.autolink]),
  surround(str('['), recursion(Recursion.terminal, some(union([bracket, unescsource]), ']')), str(']'), true,
    undefined, () => [[]], [3 | Backtrack.autolink]),
  surround(str('{'), recursion(Recursion.terminal, some(union([bracket, unescsource]), '}')), str('}'), true,
    undefined, () => [[]], [3 | Backtrack.autolink]),
  surround(str('"'), precedence(2, recursion(Recursion.terminal, some(unescsource, '"'))), str('"'), true,
    undefined, () => [[]], [3 | Backtrack.autolink]),
]));
