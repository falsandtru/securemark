import { ExtensionParser } from '../inline';
import { combine } from '../../combinator';
import { index } from './extension/index';
import { placeholder } from './extension/placeholder';

export const extension: ExtensionParser = combine<[
  ExtensionParser.IndexParser,
  ExtensionParser.PlaceholderParser
]>([
  index,
  placeholder,
]);
