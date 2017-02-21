import { ExtensionParser } from '../block';
import { compose } from '../../combinator/compose';
import { placeholder } from './extension/placeholder';

export const extension: ExtensionParser = compose<ExtensionParser[], HTMLElement>([
  placeholder,
]);
