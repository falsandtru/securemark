import { ExtensionParser } from '../../block';
import { match, rewrite, eval } from '../../../combinator';
import { block } from '../../source/block';
import { paragraph } from '../paragraph';

export const segment: ExtensionParser.PlaceholderParser = block(match(
  /^(~{3,})[^\n]*\n(?:[^\n]*\n)*?\1[^\S\n]*(?:\n|$)/,
  (_, rest) => [[], rest]));

export const placeholder: ExtensionParser.PlaceholderParser = block(rewrite(segment,
  () =>
    [eval(paragraph("*Invalid syntax: Extension syntax: ~~~.*\n")), '']));
