import { combine } from '../../combinator/combine';
import { ExtensionBlockParser } from '../block';
import { placeholder } from './extension/placeholder';
import { verifyBlockEnd } from './end';

export const extension: ExtensionBlockParser = combine<[
  ExtensionBlockParser.PlaceholderParser
], HTMLElement>([
  verifyBlockEnd(placeholder),
]);
