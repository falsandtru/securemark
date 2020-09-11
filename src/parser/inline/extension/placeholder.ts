import { ExtensionParser, inline } from '../../inline';
import { union, some, creator, surround, lazy } from '../../../combinator';
import { startTight, isEndTight, trimEnd, defrag } from '../../util';
import { str, char } from '../../source';
import { html } from 'typed-dom';
import { unshift, push } from 'spica/array';

// Already used symbols: !@$&*<
export const placeholder: ExtensionParser.PlaceholderParser = lazy(() => creator(surround(
  str(/^\[[:^]/),
  startTight(some(union([inline]), ']')),
  char(']'), false,
  ([as, bs, cs], rest) => [
    isEndTight(bs)
      ? [html('span', { class: 'invalid', 'data-invalid-syntax': 'extension', 'data-invalid-type': 'syntax', 'data-invalid-message': 'Invalid symbol.' }, defrag(trimEnd(bs)))]
      : push(unshift(as, bs), cs),
    rest
  ],
  ([as, bs], rest) => [unshift(as, bs), rest])));
