import { combine } from '../../combinator/combine';
import { placeholder } from './extension/placeholder';
import { ExtensionParser } from '../block';
import { verifyBlockEnd } from './end';

export const extension: ExtensionParser = combine<ExtensionParser[], HTMLElement>([
  placeholder,
].map(verifyBlockEnd));
