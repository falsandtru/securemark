import { ExtensionBlockParser } from '../block';
import { combine } from '../../combinator';
import { placeholder } from './extension/placeholder';

export const extension: ExtensionBlockParser = combine<HTMLElement, ExtensionBlockParser.InnerParsers>([
  placeholder,
]);
