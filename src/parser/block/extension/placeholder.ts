import { ExtensionParser } from '../../block';
import { some, block, rewrite, focus, eval } from '../../../combinator';
import { inline } from '../../inline';
import { html } from 'typed-dom';

export const segment: ExtensionParser.PlaceholderParser.SegmentParser = block(focus(
  /^(~{3,})[a-z][^\n]*\n(?:[^\n]*\n){0,300}?\1[^\S\n]*(?:\n|$)/,
  (_, config) => [[], '', config]));

export const placeholder: ExtensionParser.PlaceholderParser = block(rewrite(segment,
  (_, config) => [[html('p', { class: 'invalid', 'data-invalid-syntax': 'extension', 'data-invalid-type': 'syntax' }, eval(some(inline)('Invalid syntax: Extension: Invalid extension name, attribute, or content.', {})))], '', config]));
