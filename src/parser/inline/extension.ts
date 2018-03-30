import { ExtensionParser } from '../inline';
import { union } from '../../combinator';
import { index } from './extension/index';
import { label } from './extension/label';
import { placeholder } from './extension/placeholder';

export const extension: ExtensionParser = union<[
  ExtensionParser.IndexParser,
  ExtensionParser.LabelParser,
  ExtensionParser.PlaceholderParser
]>([
  index,
  label,
  placeholder,
]);
