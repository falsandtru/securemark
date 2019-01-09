import { ExtensionParser } from '../../block';
import { some, block, rewrite, focus, eval } from '../../../combinator';
import { inline } from '../../inline';
import { html } from 'typed-dom';

export const segment: ExtensionParser.PlaceholderParser = block(focus(
  /^(~{3,})[^\n]*(?:\n|$)(?=[^\S\n]*(?:\n|$))|^(~{3,})(?!~)[^\n]*\n(?:[^\n]*(?:\n|$))*?\1?[^\S\n]*(?:\n|$)/,
  _ => [[], '']));

export const placeholder: ExtensionParser.PlaceholderParser = block(rewrite(segment,
  () => [[html('p', { class: 'invalid', 'data-invalid-syntax': 'extension', 'data-invalid-type': 'syntax' }, eval(some(inline)('Invalid syntax: Extension: Invalid extension name, attribute, or content.')))], '']));
