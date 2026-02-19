import { ExtensionParser } from '../../inline';
import { Recursion, Backtrack } from '../../context';
import { union, some, recursion, precedence, surround, lazy } from '../../../combinator';
import { inline } from '../../inline';
import { str } from '../../source';
import { tightStart } from '../../visibility';
import { invalid } from '../../util';
import { unshift } from 'spica/array';
import { html } from 'typed-dom/dom';

// Don't use the symbols already used: !#$%@&*+~=|

// All syntax surrounded by square brackets shouldn't contain line breaks.

export const placeholder: ExtensionParser.PlaceholderParser = lazy(() => surround(
  // ^はabbrで使用済みだが^:などのようにして分離使用可能
  str(/^\[[:^|]/),
  precedence(1, recursion(Recursion.inline,
  tightStart(some(union([inline]), ']', [[']', 1]])))),
  str(']'), false,
  (_, context) => [[
    html('span',
      {
        class: 'invalid',
        ...invalid('extension', 'syntax', `Invalid start symbol or linebreak`),
      },
      context.source.slice(context.position - context.range!, context.position))
  ]],
  ([as, bs]) => bs && [unshift(as, bs)],
  [3 | Backtrack.bracket]));
