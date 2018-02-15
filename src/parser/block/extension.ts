import { ExtensionParser } from '../block';
import { combine } from '../../combinator';
import { placeholder } from './extension/placeholder';

export const extension: ExtensionParser = combine<ExtensionParser>([
  placeholder,
]);
