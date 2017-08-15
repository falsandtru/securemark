import { combine } from '../../combinator/combine';
import { ExtensionParser } from '../inline';
import { index } from './extension/index';
import { placeholder } from './extension/placeholder';

export const extension: ExtensionParser = combine<[
  ExtensionParser.IndexParser,
  ExtensionParser.PlaceholderParser
], HTMLElement>([
  index,
  placeholder,
]);
