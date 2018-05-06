import { ExtensionParser } from '../block';
import { union, capture } from '../../combinator';
import { figure } from './extension/figure';
import { placeholder } from './extension/placeholder';
import { block } from '../source/block';

export const extension: ExtensionParser = union([
  figure,
  placeholder,
]);

export const segment: ExtensionParser = block(capture(
  /^(~{3,})([^\n]*)\n((?:[^\n]*\n)*?)\1[^\S\n]*(?:\n|$)/,
  (_, rest) => [[], rest]));
