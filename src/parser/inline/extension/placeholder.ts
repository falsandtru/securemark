import { ExtensionParser } from '../../inline';
import { union, some, creator, precedence, validate, surround, lazy } from '../../../combinator';
import { inline } from '../../inline';
import { str } from '../../source';
import { startTight } from '../../visibility';
import { html, defrag } from 'typed-dom/dom';
import { unshift } from 'spica/array';

// Don't use the symbols already used: !#$@&*+~=

// All syntax surrounded by square brackets shouldn't contain line breaks.

export const placeholder: ExtensionParser.PlaceholderParser = lazy(() => validate(['[:', '[^'], creator(precedence(2, surround(
  str(/^\[[:^]/),
  startTight(some(union([inline]), ']', [[/^\\?\n/, 9], [']', 2]])),
  str(']'), false,
  ([as, bs], rest) => [[
    html('span', {
      class: 'invalid',
      'data-invalid-syntax': 'extension',
      'data-invalid-type': 'syntax',
      'data-invalid-message': `Reserved start symbol "${as[0][1]}" cannot be used in "[]"`,
    }, defrag(bs)),
  ], rest],
  ([as, bs], rest) => [unshift(as, bs), rest])))));
