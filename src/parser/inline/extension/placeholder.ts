import { ExtensionParser, inline } from '../../inline';
import { union, some, creator, surround, lazy } from '../../../combinator';
import { isTight, defrag } from '../../util';
import { str, char } from '../../source';
import { html } from 'typed-dom';
import { unshift, push } from 'spica/array';

// Already used symbols: !@$&*<
export const placeholder: ExtensionParser.PlaceholderParser = lazy(() => creator(surround(
  str(/^\[[:^]/),
  some(union([inline]), ']'),
  char(']'), false,
  ([as, bs = [], cs], rest) => [
    isTight(bs, 0, bs.length)
      ? [defrag(html('span', { class: 'invalid', 'data-invalid-syntax': 'extension', 'data-invalid-message': 'Invalid flag' }, bs))]
      : push(unshift(as, bs), cs),
    rest
  ],
  ([as, bs = []], rest) => [unshift(as, bs), rest])));
