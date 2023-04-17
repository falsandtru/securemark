import { ExtensionParser } from '../../inline';
import { union, some, syntax, validate, surround, lazy } from '../../../combinator';
import { inline } from '../../inline';
import { str } from '../../source';
import { Syntax, State } from '../../context';
import { startTight } from '../../visibility';
import { unshift } from 'spica/array';
import { html, defrag } from 'typed-dom/dom';

// Don't use the symbols already used: !#$%@&*+~=|

// All syntax surrounded by square brackets shouldn't contain line breaks.

export const placeholder: ExtensionParser.PlaceholderParser = lazy(() => validate('[', surround(
  str(/^\[[:^|]/),
  syntax(Syntax.placeholder, 2, 1, State.none,
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
  ([as, bs], rest) => [unshift(as, bs), rest])));
