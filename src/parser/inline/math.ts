import { MathParser } from '../inline';
import { union, some, validate, rewrite, creator, surround, lazy } from '../../combinator';
import { escsource, str } from '../source';
import { html } from 'typed-dom/dom';

const disallowedCommand = /\\(?:begin|tiny|huge|large)(?![0-9a-z])/i;

export const math: MathParser = lazy(() => creator(validate('$', rewrite(
  union([
    surround(
      '$',
      // Latex's reserved characters: # $ % ^ & _ { } ~ \
      // $[0-9]+                    : Dollar
      // $[A-z]*-                   : Label
      // $[A-z]*(?!-)               : Math
      // $[\^_[({|]                 : Math
      // $[#$%&]                    : Invalid first character in Latex syntax
      str(/^(?![\s{}#$%&]|\d+(?:[,.]\d+)*[^\d\-+*/=<>^_~\\$]|-[\da-z]|[a-z]+-)(?:\\\$|\x20(?!\$)|[\x21-\x23\x25-\x7E])+/i),
      /^\$(?![0-9a-z])/i),
    surround('$', bracket, '$'),
  ]),
  (source, { caches: { math: cache } = {} }) => [[
    cache?.get(source)?.cloneNode(true) ||
    html('span',
      !disallowedCommand.test(source)
        ? { class: 'math', translate: 'no', 'data-src': source }
        : {
            class: 'invalid',
            translate: 'no',
            'data-invalid-syntax': 'math',
            'data-invalid-type': 'content',
            'data-invalid-message': `"${source.match(disallowedCommand)![0]}" command is disallowed`,
          },
      source)
  ], '']))));

const bracket: MathParser.BracketParser = lazy(() => creator(surround(
  '{',
  some(union([
    bracket,
    some(escsource, /^(?:[{}]|\\?\n)/),
  ])),
  '}',
  true)));
