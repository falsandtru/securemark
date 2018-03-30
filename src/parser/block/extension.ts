import { ExtensionParser } from '../block';
import { union } from '../../combinator';
import { figure } from './extension/figure';
import { placeholder } from './extension/placeholder';

export const extension: ExtensionParser = union<ExtensionParser>([
  figure,
  placeholder,
]);
