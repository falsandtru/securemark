import { combine } from '../../combinator/combine';
import { placeholder } from './extension/placeholder';
import { ExtensionParser } from '../block';

export const extension: ExtensionParser = combine<ExtensionParser[], HTMLElement>([
  placeholder,
]);
