import { ExtensionParser } from '../../block';
import { some, match, rewrite, eval } from '../../../combinator';
import { block } from '../../source/block';
import { inline } from '../../inline';
import { html } from 'typed-dom';

export const segment: ExtensionParser.PlaceholderParser = block(match(
  /^(~{3,})[^\n]*\n(?:[^\n]*\n)*?\1[^\S\n]*(?:\n|$)/,
  (_, rest) => [[], rest]));

export const placeholder: ExtensionParser.PlaceholderParser = block(rewrite(segment,
  () => [[html('p', { class: 'invalid' }, eval(some(inline)('Invalid syntax: Extension syntax: ~~~.')))], '']));
