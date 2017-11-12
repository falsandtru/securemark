import { ExtensionBlockParser } from '../block';
import { combine } from '../../combinator';
import { placeholder } from './extension/placeholder';
import { verifyBlockEnd } from './end';

export const extension: ExtensionBlockParser = combine<HTMLElement, ExtensionBlockParser.InnerParsers>([
  verifyBlockEnd(placeholder),
]);
