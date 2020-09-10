import { ExtensionParser } from '../block';
import { union, validate, rewrite } from '../../combinator';
import { figbase } from './extension/figbase';
import { segment as seg_figbase } from './extension/figbase';
import { fig, segment as seg_fig } from './extension/fig';
import { figure, segment as seg_figure } from './extension/figure';
import { example, segment as seg_example } from './extension/example';
import { placeholder, segment as seg_placeholder } from './extension/placeholder';

export const segment: ExtensionParser.SegmentParser = validate(['~~~', '[$', '$'], validate(/^~{3,}|^\[?\$[a-z-]\S+[^\S\n]*(?:\n|$)/, union([
  seg_figbase,
  seg_fig,
  seg_figure,
  seg_example,
  seg_placeholder,
])));

export const extension: ExtensionParser = rewrite(segment, union([
  figbase,
  fig,
  figure,
  example,
  placeholder,
]));
