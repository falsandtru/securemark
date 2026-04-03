import { ExtensionParser } from '../../inline';
import { Recursion, Backtrack } from '../../context';
import { List, Node } from '../../../combinator/parser';
import { union, some, recursion, precedence, backtrack, surround, lazy } from '../../../combinator';
import { inline } from '../../inline';
import { str } from '../../source';
import { beforeNonblank } from '../../visibility';
import { invalid } from '../../util';
import { html } from 'typed-dom/dom';

// Don't use the symbols already used: !#$%@&*+~=|

// All syntax surrounded by square brackets shouldn't contain line breaks.

export const placeholder: ExtensionParser.PlaceholderParser = lazy(() => backtrack(surround(
  // ^はabbrで使用済みだが^:などのようにして分離使用可能
  str(/\[[:^|]/y, beforeNonblank),
  precedence(1, recursion(Recursion.inline,
  some(union([inline]), ']', [[']', 1]]))),
  str(']'),
  false,
  [3 | Backtrack.common],
  (_, input, output) =>
    output.append(new Node(html('span',
      {
        class: 'invalid',
        ...invalid('extension', 'syntax', `Invalid start symbol or linebreak`),
      },
      input.source.slice(input.position - input.range, input.position)))),
  ([as, bs], _, output) => bs && output.import(as.import(bs as List<Node<string>>)))));
