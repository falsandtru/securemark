import { ExtensionParser } from '../block';
import { union, validate, rewrite } from '../../combinator';
import { fig, segment as seg_fig } from './extension/fig';
import { figure, segment as seg_figure } from './extension/figure';
import { graph, segment as seg_graph } from './extension/graph';
import { example, segment as seg_example } from './extension/example';
import { placeholder, segment as seg_placeholder } from './extension/placeholder';

export const segment: ExtensionParser = validate(/^~~~|^\[:[^\]\s]+\][^\S\n]*\n/, union([
  seg_fig,
  seg_figure,
  seg_graph,
  seg_example,
  seg_placeholder,
]));

export const extension: ExtensionParser = rewrite(segment, union([
  fig,
  figure,
  graph,
  example,
  placeholder,
]));
