import { ExtensionParser } from '../block';
import { union, validate, focus } from '../../combinator';
import { fig, segment as seg_fig } from './extension/fig';
import { figure, segment as seg_figure } from './extension/figure';
import { example, segment as seg_example } from './extension/example';
import { placeholder, segment as seg_placeholder } from './extension/placeholder';

export const segment: ExtensionParser = validate(/^~~~|^\[:[^\]\s]+\][^\S\n]*\n/, union([
  seg_fig,
  seg_figure,
  seg_example,
  seg_placeholder,
]));

export const extension: ExtensionParser = focus(segment, union([
  fig,
  figure,
  example,
  placeholder,
]));
