import { ExtensionParser } from '../../block';
import { block, rewrite, focus } from '../../../combinator';
import { html } from 'typed-dom';

export const segment: ExtensionParser.PlaceholderParser.SegmentParser = block(focus(
  /^(~{3,})[a-z][^\n]*\n(?:[^\n]*\n){0,300}?\1[^\S\n]*(?:$|\n)/,
  () => [[], '']));

export const placeholder: ExtensionParser.PlaceholderParser = block(rewrite(segment,
  () => [[html('p', { class: 'invalid', 'data-invalid-syntax': 'extension', 'data-invalid-message': 'Invalid extension name, parameter, or content' })], '']));
