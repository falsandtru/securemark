import { ExtensionParser, inline } from '../../inline';
import { union, some, creator, backtracker, open, close, lazy } from '../../../combinator';
import { isVisible, defrag } from '../../util';
import { str } from '../../source';
import { html } from 'typed-dom';

// Already used symbols: !@$&*<
export const placeholder: ExtensionParser.PlaceholderParser = lazy(() => creator(close(open(
  str(/^\[[:^]/),
  some(union([inline]), ']')),
  backtracker(str(']')),
  (ns, rest) => [
    ns.length >= 3 && isVisible(ns[1])
      ? [defrag(html('span', { class: 'invalid', 'data-invalid-syntax': 'extension', 'data-invalid-message': 'Invalid flag' }, ns.slice(1, -1)))]
      : ns,
    rest
  ])));
