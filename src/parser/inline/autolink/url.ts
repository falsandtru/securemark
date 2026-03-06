import { AutolinkParser } from '../../inline';
import { State, Recursion, Backtrack } from '../../context';
import { List } from '../../../combinator/data/parser';
import { union, tails, some, recursion, precedence, state, constraint, verify, focus, rewrite, convert, surround, open, lazy } from '../../../combinator';
import { inline } from '../../inline';
import { unsafelink } from '../link';
import { unescsource, str } from '../../source';

export const url: AutolinkParser.UrlParser = lazy(() => rewrite(
  open(
    /(?<![0-9A-Za-z][.+-]?|[@#])https?:\/\/(?=[\x21-\x7E])/y,
    precedence(0, some(union([
      some(unescsource, /(?<![-+*=~^_,.;:!?]|\/{3})(?:[-+*=~^_,.;:!?]|\/{3,}(?!\/))*(?=[\\$"`\[\](){}<>（）［］｛｝|]|[^\x21-\x7E]|$)/y),
      precedence(1, verify(bracket, ns => ns.length > 0)),
    ]), undefined, [[/[^\x21-\x7E]|\$/y, 9]])),
    false,
    [3 | Backtrack.autolink]),
  union([
    constraint(State.autolink, state(State.autolink, convert(
      url => `{ ${url} }`,
      unsafelink,
      false))),
    open(str(/[^:]+/y), some(inline)),
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
      open(str(/[^:]+/y), some(inline)),
    ]),
  ])));

const bracket: AutolinkParser.UrlParser.BracketParser = lazy(() => union([
  surround(str('('), recursion(Recursion.terminal, some(union([bracket, unescsource]), ')')), str(')'),
    true, [3 | Backtrack.autolink], undefined, () => new List()),
  surround(str('['), recursion(Recursion.terminal, some(union([bracket, unescsource]), ']')), str(']'),
    true, [3 | Backtrack.autolink], undefined, () => new List()),
  surround(str('{'), recursion(Recursion.terminal, some(union([bracket, unescsource]), '}')), str('}'),
    true, [3 | Backtrack.autolink], undefined, () => new List()),
  surround(str('"'), precedence(2, recursion(Recursion.terminal, some(unescsource, '"'))), str('"'),
    true, [3 | Backtrack.autolink], undefined, () => new List()),
]));
