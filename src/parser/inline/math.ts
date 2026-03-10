import { MathParser } from '../inline';
import { Backtrack, Recursion } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { union, some, recursion, precedence, rewrite, surround, lazy } from '../../combinator';
import { escsource, str } from '../source';
import { invalid } from '../util';
import { html } from 'typed-dom/dom';

const forbiddenCommand = /\\(?:begin|tiny|huge|large)(?![a-z])|:\/\//i;

export const math: MathParser = lazy(() => rewrite(
  union([
    surround(
      /\$(?={)/y,
      precedence(4, bracket),
      '$',
      false,
      [3 | Backtrack.escapable]),
    surround(
      /\$(?![\s{}])/y,
      precedence(2, some(union([
        some(escsource, /\$|[`"{}\n]/y),
        precedence(4, bracket),
      ]))),
      /(?<!\s)\$(?![-0-9A-Za-z])/y,
      false,
      [3 | Backtrack.escapable]),
  ]),
  ({ context: { source, caches: { math: cache } = {} } }) => new List([
    new Node(cache?.get(source)?.cloneNode(true) ||
    html('span',
      !forbiddenCommand.test(source)
        ? { class: 'math', translate: 'no', 'data-src': source }
        : {
            class: 'invalid',
            translate: 'no',
            ...invalid('math', 'content',
              `"${source.match(forbiddenCommand)![0]}" command is forbidden`),
          },
      source))
  ])));

const bracket: MathParser.BracketParser = lazy(() => surround(
  str('{'),
  recursion(Recursion.terminal,
  some(union([
    bracket,
    some(escsource, /[{}$\n]/y),
  ]))),
  str('}'),
  true));
