import { MathParser } from '../inline';
import { union, some, validate, verify, rewrite, creator, surround, lazy } from '../../combinator';
import { escsource, str } from '../source';
import { isEndTightNodes } from '../util';
import { html } from 'typed-dom';

const disallowedCommand = /\\(?:begin|tiny|huge|large)(?![0-9a-z])/i;

export const math: MathParser = lazy(() => creator(validate('$', '$', '\n', rewrite(
  union([
    surround(
      '$',
      verify(
        // Latex's reserved characters: # $ % ^ & _ { } ~ \
        // $[0-9]+                    : Dollar
        // $[A-z]*-                   : Label
        // $[A-z]*(?!-)               : Math
        // $[\^_[({|]                 : Math
        // $[#$%&]                    : Invalid first character in Latex syntax
        str(/^(?![\s{}#$%&]|\d+(?:[,.]\d+)*(?:[\s,.!?()[\]{}]|[^\x00-\x7F])|-[\da-z]|[a-z]+-)(?:\\\$|[\x20-\x23\x25-\x7E])*/i),
        isEndTightNodes),
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
            'data-invalid-description': `"${source.match(disallowedCommand)![0]}" command is disallowed.`,
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
