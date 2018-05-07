import { ExtensionParser } from '../../block';
import { capture, rewrite } from '../../../combinator';
import { block } from '../../source/block';
import { paragraph } from '../paragraph';

export const segment: ExtensionParser.PlaceholderParser = block(capture(
  /^(~{3,})[^\n]*\n(?:[^\n]*\n)*?\1[^\S\n]*(?:\n|$)/,
  (_, rest) => [[], rest]));

export const placeholder: ExtensionParser.PlaceholderParser = block(rewrite(segment,
  () =>
    [paragraph("**WARNING: DON'T USE `~~~` SYNTAX!!**\\\nThis *extension syntax* is reserved for extensibility.\n")![0], '']));
