import { ExtensionParser } from '../block';
import { combine } from '../../combinator';
import { figure } from './extension/figure';
import { placeholder } from './extension/placeholder';

export const extension: ExtensionParser = combine<ExtensionParser>([
  figure,
  placeholder,
]);
