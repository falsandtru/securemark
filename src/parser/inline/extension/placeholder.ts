import { ExtensionParser } from '../../inline';
import { union, some, syntax, creation, validate, surround, lazy } from '../../../combinator';
import { inline } from '../../inline';
import { str } from '../../source';
import { State, Recursion, Backtrack } from '../../context';
import { startTight } from '../../visibility';
import { unshift } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

// Don't use the symbols already used: !#$%@&*+~=|

// All syntax surrounded by square brackets shouldn't contain line breaks.

export const placeholder: ExtensionParser.PlaceholderParser = lazy(() => validate('[', creation(1, Recursion.inline, surround(
  str(/^\[[:^|]/),
  syntax(2, State.none,
  startTight(some(union([inline]), ']', [[']', 2]]))),
  str(']'), false,
  ([, bs], rest) => [[
    html('span', {
      class: 'invalid',
      'data-invalid-syntax': 'extension',
      'data-invalid-type': 'syntax',
      'data-invalid-message': `Invalid start symbol or linebreak`,
    }, defrag(bs)),
  ], rest],
  ([as, bs], rest) => [unshift(as, bs), rest], 3 | Backtrack.bracket))));
