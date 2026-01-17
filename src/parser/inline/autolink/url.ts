import { AutolinkParser } from '../../inline';
import { State, Recursion, Backtrack, Command } from '../../context';
import { union, tails, some, creation, precedence, state, constraint, validate, verify, focus, rewrite, convert, surround, open, lazy } from '../../../combinator';
import { unsafelink } from '../link';
import { linebreak, unescsource, str } from '../../source';

const closer = /^[-+*=~^_,.;:!?]*(?=[\\"`|\[\](){}<>]|$)/;

export const url: AutolinkParser.UrlParser = lazy(() => validate(['http://', 'https://'], rewrite(
  open(
    /^https?:\/\/(?=[\x21-\x7E])/,
    focus(/^[\x21-\x7E]+/, precedence(1, some(verify(union([
      bracket,
      some(unescsource, closer),
    ]), ns => ns[0] !== Command.Escape))))),
  union([
    constraint(State.autolink, false, state(State.autolink, convert(
      url => `{ ${url} }`,
      unsafelink))),
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
          unsafelink))),
        ({ source }) => [[source], ''],
      ]),
    ]))));

const bracket: AutolinkParser.UrlParser.BracketParser = lazy(() => creation(0, Recursion.terminal, union([
  surround(str('('), some(union([bracket, unescsource]), ')'), str(')'), true,
    undefined, () => [[Command.Escape], ''], 3 | Backtrack.url),
  surround(str('['), some(union([bracket, unescsource]), ']'), str(']'), true,
    undefined, () => [[Command.Escape], ''], 3 | Backtrack.url),
  surround(str('{'), some(union([bracket, unescsource]), '}'), str('}'), true,
    undefined, () => [[Command.Escape], ''], 3 | Backtrack.url),
  surround(str('"'), precedence(2, some(unescsource, '"')), str('"'), true,
    undefined, () => [[Command.Escape], ''], 3 | Backtrack.url),
])));
