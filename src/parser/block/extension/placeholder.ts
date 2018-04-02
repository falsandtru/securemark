import { ExtensionParser } from '../../block';
import { match } from '../../../combinator';
import { block } from '../../source/block';
import { paragraph } from '../paragraph';

const syntax = /^(~{3,})([^\n]*)\n((?:[^\n]*\n)*?)\1[^\S\n]*(?:\n|$)/;

export const placeholder: ExtensionParser.PlaceholderParser = block(match(syntax, ([whole], source) => {
  const [[message]] = paragraph("**WARNING: DON'T USE `~~~` SYNTAX!!**\\\nThis *extension syntax* is reserved for extensibility.")!;
  return [[message], source.slice(whole.length)];
}));
