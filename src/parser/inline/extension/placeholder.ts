import { ExtensionParser } from '../../inline';
import { Recursion, Backtrack } from '../../context';
import { union, some, recursion, precedence, surround, lazy } from '../../../combinator';
import { inline } from '../../inline';
import { str } from '../../source';
import { tightStart } from '../../visibility';
import { unshift } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

// Don't use the symbols already used: !#$%@&*+~=|

// All syntax surrounded by square brackets shouldn't contain line breaks.

export const placeholder: ExtensionParser.PlaceholderParser = lazy(() => surround(
  str(/^\[[:^|]/),
  precedence(1, recursion(Recursion.inline,
  tightStart(some(union([inline]), ']', [[']', 1]])))),
  str(']'), false,
  ([, bs], rest) => [[
    html('span', {
      class: 'invalid',
      'data-invalid-syntax': 'extension',
      'data-invalid-type': 'syntax',
      'data-invalid-message': `Invalid start symbol or linebreak`,
    }, defrag(bs)),
  ], rest],
  ([as, bs], rest) => [unshift(as, bs), rest], [3 | Backtrack.bracket]));
