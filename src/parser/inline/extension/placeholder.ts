import { ExtensionParser } from '../../inline';
import { union, some, validate, creator, surround, lazy } from '../../../combinator';
import { inline } from '../../inline';
import { str } from '../../source';
import { startTight, isEndTight, trimEndBR } from '../../util';
import { html, defrag } from 'typed-dom';
import { unshift, push } from 'spica/array';

// Don't use the symbols already used: !#$@&*+~=

export const placeholder: ExtensionParser.PlaceholderParser = lazy(() => creator(validate(['[:', '[^'], ']', surround(
  str(/^\[[:^]/),
  startTight(some(union([inline]), ']')),
  str(']'), false,
  ([as, bs, cs], rest) => [
    isEndTight(bs)
      ? [html('span', { class: 'invalid', 'data-invalid-syntax': 'extension', 'data-invalid-type': 'syntax', 'data-invalid-description': 'Invalid symbol.' }, defrag(trimEndBR(bs)))]
      : push(unshift(as, bs), cs),
    rest
  ],
  ([as, bs], rest) => [unshift(as, bs), rest]))));
