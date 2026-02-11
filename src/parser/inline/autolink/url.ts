import { AutolinkParser } from '../../inline';
import { State, Recursion, Backtrack } from '../../context';
import { union, tails, some, recursion, precedence, state, constraint, validate, verify, focus, rewrite, convert, surround, open, lazy } from '../../../combinator';
import { unsafelink } from '../link';
import { linebreak, unescsource, str } from '../../source';

const closer = /^[-+*=~^_,.;:!?]*(?=[\\"`|\[\](){}<>]|$)/;

export const url: AutolinkParser.UrlParser = lazy(() => validate(['http://', 'https://'], rewrite(
  open(
    /^https?:\/\/(?=[\x21-\x7E])/,
    focus(/^[\x21-\x7E]+/, precedence(1, some(union([
      verify(bracket, ns => ns.length > 0),
      some(unescsource, closer),
    ])))),
    false,
    [3 | Backtrack.linebracket]),
  union([
    constraint(State.autolink, false, state(State.autolink, convert(
      url => `{ ${url} }`,
      unsafelink,
      false))),
    ({ source }) => [[source], ''],
  ]))));

export const lineurl: AutolinkParser.UrlParser.LineUrlParser = lazy(() => open(
  linebreak,
  focus(
    /^!?https?:\/\/\S+(?=[^\S\n]*(?:$|\n))/,
    tails([
      str('!'),
      union([
        constraint(State.autolink, false, state(State.autolink, convert(
          url => `{ ${url} }`,
          unsafelink,
          false))),
        ({ source }) => [[source], ''],
      ]),
    ])),
  false,
  [3 | Backtrack.linebracket]));

const bracket: AutolinkParser.UrlParser.BracketParser = lazy(() => union([
  surround(str('('), recursion(Recursion.terminal, some(union([bracket, unescsource]), ')')), str(')'), true,
    undefined, () => [[], ''], [3 | Backtrack.lineunescbracket]),
  surround(str('['), recursion(Recursion.terminal, some(union([bracket, unescsource]), ']')), str(']'), true,
    undefined, () => [[], ''], [3 | Backtrack.lineunescbracket]),
  surround(str('{'), recursion(Recursion.terminal, some(union([bracket, unescsource]), '}')), str('}'), true,
    undefined, () => [[], ''], [3 | Backtrack.lineunescbracket]),
  surround(str('"'), precedence(2, recursion(Recursion.terminal, some(unescsource, '"'))), str('"'), true,
    undefined, () => [[], ''], [3 | Backtrack.lineunescbracket]),
]));
