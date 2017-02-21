import { ExtensionParser } from '../block';
import { combine } from '../../combinator/combine';
import { placeholder } from './extension/placeholder';

export const extension: ExtensionParser = combine<ExtensionParser[], HTMLElement>([
  placeholder,
]);
