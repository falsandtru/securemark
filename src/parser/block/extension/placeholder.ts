import { ExtensionParser } from '../../block';
import { match } from '../../../combinator';
import { block } from '../../source/block';
import { paragraph } from '../paragraph';

const syntax = /^(~{3,})([^\n]*)\n((?:[^\n]*\n)*?)\1[^\S\n]*(?:\n|$)/;

export const placeholder: ExtensionParser.PlaceholderParser = block(match(syntax, (_, rest) => [
  paragraph("**WARNING: DON'T USE `~~~` SYNTAX!!**\\\nThis *extension syntax* is reserved for extensibility.\n")![0],
  rest
]));
