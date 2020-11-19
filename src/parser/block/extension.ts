import { ExtensionParser } from '../block';
import { union, validate } from '../../combinator';
import { figbase } from './extension/figbase';
import { fig, segment as seg_fig } from './extension/fig';
import { figure, segment as seg_figure } from './extension/figure';
import { example, segment as seg_example } from './extension/example';
import { aside } from './extension/aside';
import { placeholder, segment as seg_placeholder } from './extension/placeholder';

export const segment: ExtensionParser.SegmentParser = validate(['~~~', '[$', '$'], validate(/^~{3,}|^\[?\$[a-z-]\S+[^\S\n]*(?:$|\n)/, union([
  seg_fig,
  seg_figure,
  seg_example,
  seg_placeholder,
])));

export const extension: ExtensionParser = union([
  figbase,
  fig,
  figure,
  example,
  aside,
  placeholder,
]);
