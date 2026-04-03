import { AutolinkParser } from '../../inline';
import { State, Recursion, Backtrack } from '../../context';
import { List, Node } from '../../../combinator/parser';
import { union, tails, some, recursion, precedence, state, constraint, backtrack, focus, rewrite, surround, open, lazy } from '../../../combinator';
import { parse } from '../link';
import { unescsource, str } from '../../source';

export const url: AutolinkParser.UrlParser = lazy(() => rewrite(
  open(
    /(?<![0-9A-Za-z][.+-]?|[@#])https?:\/\/(?=[[0-9A-Za-z])/y,
    precedence(0, some(union([
      some(unescsource, /(?<![-+*=~^_,.;:!?]|\/{3})(?:[-+*=~^_,.;:!?]|\/{3,}(?!\/))*(?=[\\$"`\[\](){}<>（）［］｛｝|]|[^\x21-\x7E]|$)/y),
      precedence(1, bracket),
    ]), [[/[^\x21-\x7E]|\$/y, 9]])),
    false,
    [3 | Backtrack.unescapable]),
  union([
    constraint(State.autolink, state(State.autolink, (input, output) =>
      output.append(new Node(parse(new List(), new List([new Node(input.source)]), input))))),
    (input, output) => output.append(new Node(input.source)),
  ])));

export const lineurl: AutolinkParser.UrlParser.LineUrlParser = lazy(() => focus(
  /(?<=^|[\r\n])!?https?:\/\/\S+(?=[^\S\r\n]*(?=$|\r?\n))/y,
  tails([
    str('!'),
    union([
      constraint(State.autolink, state(State.autolink, (input, output) => {
        const { source, position } = input;
        input.position = source.length;
        return output.append(
          new Node(parse(
            new List(),
            new List([new Node(source.slice(position))]),
            input)));
      })),
      (input, output) => output.append(new Node(input.source.slice(input.position))),
    ]),
  ])));

const bracket: AutolinkParser.UrlParser.BracketParser = lazy(() => backtrack(union([
  surround(str('('), recursion(Recursion.bracket, some(union([bracket, unescsource]), ')')), str(')'),
    true, [3 | Backtrack.unescapable]),
  surround(str('['), recursion(Recursion.bracket, some(union([bracket, unescsource]), ']')), str(']'),
    true, [3 | Backtrack.unescapable]),
  surround(str('{'), recursion(Recursion.bracket, some(union([bracket, unescsource]), '}')), str('}'),
    true, [3 | Backtrack.unescapable]),
  surround(str('"'), precedence(2, recursion(Recursion.bracket, some(unescsource, '"'))), str('"'),
    true, [3 | Backtrack.unescapable]),
])));
