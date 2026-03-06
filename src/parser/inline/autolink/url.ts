import { AutolinkParser } from '../../inline';
import { State, Recursion, Backtrack } from '../../context';
import { List, Data } from '../../../combinator/data/parser';
import { union, tails, some, recursion, precedence, state, constraint, verify, focus, rewrite, surround, open, lazy } from '../../../combinator';
import { inline } from '../../inline';
import { parse } from '../link';
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
    constraint(State.autolink, state(State.autolink, ({ context }) =>
      new List([new Data(parse(new List(), new List([new Data(context.source)]), context))]))),
    open(str(/[^:]+/y), some(inline)),
  ])));

export const lineurl: AutolinkParser.UrlParser.LineUrlParser = lazy(() => focus(
  /(?<=^|[\r\n])!?https?:\/\/\S+(?=[^\S\n]*(?=$|\n))/y,
  tails([
    str('!'),
    union([
      constraint(State.autolink, state(State.autolink, ({ context }) => {
        const { source, position } = context;
        context.position -= source[0] === '!' ? 1 : 0;
        context.position += source.length;
        return new List([
          new Data(parse(
            new List(),
            new List([new Data(source.slice(position))]),
            context))
        ]);
      })),
      str(/[^:]+/y),
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
