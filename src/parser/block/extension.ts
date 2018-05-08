import { ExtensionParser } from '../block';
import { union } from '../../combinator';
import { fig, segment as seg_fig } from './extension/fig';
import { figure, segment as seg_figure } from './extension/figure';
import { placeholder, segment as seg_placeholder } from './extension/placeholder';

export const segment: ExtensionParser = union([
  seg_fig,
  seg_figure,
  seg_placeholder,
]);

export const extension: ExtensionParser = union([
  fig,
  figure,
  placeholder,
]);
