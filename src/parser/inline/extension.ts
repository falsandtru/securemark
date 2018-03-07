import { ExtensionParser } from '../inline';
import { combine } from '../../combinator';
import { index } from './extension/index';
import { label } from './extension/label';
import { placeholder } from './extension/placeholder';

export const extension: ExtensionParser = combine<[
  ExtensionParser.IndexParser,
  ExtensionParser.LabelParser,
  ExtensionParser.PlaceholderParser
]>([
  index,
  label,
  placeholder,
]);
