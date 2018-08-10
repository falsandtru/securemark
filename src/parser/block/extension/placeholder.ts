import { ExtensionParser } from '../../block';
import { some, match, block, focus, eval } from '../../../combinator';
import { inline } from '../../inline';
import { html } from 'typed-dom';

export const segment: ExtensionParser.PlaceholderParser = block(match(
  /^(~{3,})[^\n]*\n(?:[^\n]*\n)*?\1[^\S\n]*(?:\n|$)/,
  (_, rest) => [[], rest]));

export const placeholder: ExtensionParser.PlaceholderParser = block(focus(segment,
  () => [[html('p', { class: 'invalid' }, eval(some(inline)('Invalid syntax: Extension syntax: ~~~.')))], '']));
