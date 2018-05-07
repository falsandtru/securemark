import { ExtensionParser } from '../block';
import { union } from '../../combinator';
import { figure, segment as figseg } from './extension/figure';
import { placeholder, segment as phseg } from './extension/placeholder';

export const segment: ExtensionParser = union([
  figseg,
  phseg,
]);

export const extension: ExtensionParser = union([
  figure,
  placeholder,
]);
