import { MathParser } from '../inline';
import { Backtrack, Recursion } from '../context';
import { union, some, recursion, precedence, validate, focus, rewrite, surround, lazy } from '../../combinator';
import { escsource, str } from '../source';
import { invalid } from '../util';
import { html } from 'typed-dom/dom';

const forbiddenCommand = /\\(?:begin|tiny|huge|large)(?![a-z])/i;

export const math: MathParser = lazy(() => validate('$', rewrite(
  union([
    surround(
      /^\$(?={)/,
      precedence(5, bracket),
      '$',
      false, undefined, undefined, [3 | Backtrack.bracket]),
    surround(
      /^\$(?![\s{}])/,
      precedence(2, some(union([
        precedence(5, bracket),
        some(focus(
          /^(?:[ ([](?!\$)|\\[\\{}$#]?|[!%&')\x2A-\x5A\]^_\x61-\x7A|~])/,
          escsource,
          false),
          '://'),
      ]))),
      /^\$(?![0-9A-Za-z])/,
      false, undefined, undefined, [3 | Backtrack.bracket]),
  ]),
  ({ source, context: { caches: { math: cache } = {} } }) => [[
    cache?.get(source)?.cloneNode(true) ||
    html('span',
      !forbiddenCommand.test(source)
        ? { class: 'math', translate: 'no', 'data-src': source }
        : {
            class: 'invalid',
            translate: 'no',
            ...invalid('math', 'content',
              `"${source.match(forbiddenCommand)![0]}" command is forbidden`),
          },
      source)
  ], ''])));

const bracket: MathParser.BracketParser = lazy(() => surround(
  str('{'),
  recursion(Recursion.terminal,
  some(union([
    bracket,
    some(escsource, /^[{}$#\n]/),
  ]))),
  str('}'),
  true));
