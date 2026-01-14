import { MathParser } from '../inline';
import { Recursion } from '../context';
import { union, some, creation, precedence, validate, focus, rewrite, surround, lazy } from '../../combinator';
import { escsource, unescsource, str } from '../source';
import { html } from 'typed-dom/dom';

const forbiddenCommand = /\\(?:begin|tiny|huge|large)(?![a-z])/i;

export const math: MathParser = lazy(() => validate('$', creation(1, Recursion.ignore, rewrite(
  union([
    surround('$', precedence(5, bracket), '$'),
    surround(
      /^\$(?![\s{}])/,
      precedence(2, some(union([
        bracket,
        focus(/^(?:[ ([](?!\$)|\\[\\{}$]?|[!#%&')\x2A-\x5A\]^_\x61-\x7A|~])+/, some(unescsource)),
      ]))),
      /^\$(?![0-9A-Za-z])/),
  ]),
  ({ source, context: { caches: { math: cache } = {} } }) => [[
    cache?.get(source)?.cloneNode(true) ||
    html('span',
      !forbiddenCommand.test(source)
        ? { class: 'math', translate: 'no', 'data-src': source }
        : {
            class: 'invalid',
            translate: 'no',
            'data-invalid-syntax': 'math',
            'data-invalid-type': 'content',
            'data-invalid-message': `"${source.match(forbiddenCommand)![0]}" command is forbidden`,
          },
      source)
  ], '']))));

const bracket: MathParser.BracketParser = lazy(() => creation(0, Recursion.terminal, surround(
  str('{'),
  some(union([
    bracket,
    some(escsource, /^[{}$\n]/),
  ])),
  str('}'),
  true)));
