import { ExtensionParser } from '../../block';
import { paragraph } from '../paragraph';

export const placeholder: ExtensionParser.PlaceholderParser = _ => [
  paragraph("**WARNING: DON'T USE `~~~` SYNTAX!!**\\\nThis *extension syntax* is reserved for extensibility.\n")![0],
  ''
];
