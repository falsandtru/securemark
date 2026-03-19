import { ExtensionParser } from '../../inline';
import { Recursion, Backtrack } from '../../context';
import { List, Node } from '../../../combinator/data/parser';
import { union, some, recursion, precedence, surround, lazy } from '../../../combinator';
import { inline } from '../../inline';
import { str } from '../../source';
import { beforeNonblank } from '../../visibility';
import { invalid } from '../../util';
import { html } from 'typed-dom/dom';

// Don't use the symbols already used: !#$%@&*+~=|

// All syntax surrounded by square brackets shouldn't contain line breaks.

export const placeholder: ExtensionParser.PlaceholderParser = lazy(() => surround(
  // ^はabbrで使用済みだが^:などのようにして分離使用可能
  str(/\[[:^|]/y, beforeNonblank),
  precedence(1, recursion(Recursion.bracket,
  some(union([inline]), ']', [[']', 1]]))),
  str(']'),
  false,
  [3 | Backtrack.common],
  (_, context) => new List([
    new Node(html('span',
      {
        class: 'invalid',
        ...invalid('extension', 'syntax', `Invalid start symbol or linebreak`),
      },
      context.source.slice(context.position - context.range, context.position)))
  ]),
  ([as, bs]) => bs && as.import(bs as List<Node<string>>)));
