import { ExtensionBlockParser } from '../block';
import { SubParsers, combine } from '../../combinator';
import { placeholder } from './extension/placeholder';

export const extension: ExtensionBlockParser = combine<SubParsers<ExtensionBlockParser>>([
  placeholder,
]);
