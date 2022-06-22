import { MathParser } from '../inline';
import { union, some, validate, rewrite, precedence, creator, surround, lazy } from '../../combinator';
import { escsource, str } from '../source';
import { html } from 'typed-dom/dom';

const syntax = /^(?:[ ([](?!\$)|\\[\\{}$]?|[!#%&')\x2A-\x5A\]^_\x61-\x7A|~])+/;
const forbiddenCommand = /\\(?:begin|tiny|huge|large)(?![a-z])/i;

export const math: MathParser = lazy(() => creator(precedence(7, validate('$', rewrite(
  union([
    surround('$', bracket, '$'),
    surround(
      /^\$(?![\s{}])/,
      some(union([
        bracket,
        quote,
        str(syntax),
      ])),
      /^\$(?![0-9A-Za-z])/),
  ]),
  (source, { caches: { math: cache } = {} }) => [[
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
  ], ''])))));

const bracket: MathParser.BracketParser = lazy(() => creator(surround(
  '{',
  some(union([
    bracket,
    some(escsource, /^(?:[{}$]|\\?\n)/),
  ])),
  '}',
  true)));

const quote: MathParser.QuoteParser = lazy(() => creator(surround(
  '``',
  some(union([
    bracket,
    quote,
    str(syntax),
  ])),
  '"',
  true)));
