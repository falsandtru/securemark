import { ExtensionParser } from '../../inline';
import { union, some, validate, creator, surround, lazy } from '../../../combinator';
import { inline } from '../../inline';
import { str } from '../../source';
import { startTight } from '../../util';
import { html, defrag } from 'typed-dom/dom';
import { unshift } from 'spica/array';

// Don't use the symbols already used: !#$@&*+~=

// All syntax surrounded by square brackets shouldn't contain line breaks.

export const placeholder: ExtensionParser.PlaceholderParser = lazy(() => creator(validate(['[:', '[^'], ']', '\n', surround(
  str(/^\[[:^]/),
  startTight(some(union([inline]), ']')),
  str(']'), false,
  ([, bs], rest) => [[
    html('span', {
      class: 'invalid',
      'data-invalid-syntax': 'extension',
      'data-invalid-type': 'syntax',
      'data-invalid-message': 'Invalid symbol',
    }, defrag(bs)),
  ], rest],
  ([as, bs], rest) => [unshift(as, bs), rest]))));
