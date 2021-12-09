import { MathParser } from '../inline';
import { union, some, validate, verify, rewrite, creator, surround, lazy } from '../../combinator';
import { escsource, str } from '../source';
import { isEndTightNodes } from '../util';
import { html } from 'typed-dom';

const disallowedCommand = /\\(?:begin|tiny|huge|large)(?![0-9a-z])/i;

export const math: MathParser = lazy(() => creator(validate('$', '$', '\n', rewrite(
  union([
    surround('$', bracket, '$'),
    surround(
      '$',
      verify(
        // Latex's reserved characters: # $ % ^ & _ { } ~ \
        // $[0-9]+                    : Dollar
        // $[A-z]*-                   : Label
        // $[A-z]*(?!-)               : Math
        // $[\^_[({|]                 : Math
        // $[#$%&]                    : Invalid first character in latex syntax
        // $[A-z]*[,.!?()]            : Incomplete syntax before texts
        // $[A-z]*\s?[!@#&*+~=`$[]{<] : Incomplete syntax in or around another syntax
        str(/^(?=[\\^_[(|]|[A-Za-z][0-9A-Za-z]*'*[ ~]?(?:\$|([\\^_(|:=<>])(?!\1)))(?:\\\$|[\x20-\x23\x25-\x7E])*/),
        isEndTightNodes),
      /^\$(?![0-9A-Za-z])/),
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
    some(escsource, /^[{}]/),
  ])),
  '}',
  true)));
