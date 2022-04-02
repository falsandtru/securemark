import { ExtensionParser } from '../block';
import { union, validate } from '../../combinator';
import { figbase } from './extension/figbase';
import { fig, segment as seg_fig } from './extension/fig';
import { figure, segment as seg_figure } from './extension/figure';
import { table, segment as seg_table } from './extension/table';
import { message } from './extension/message';
import { aside } from './extension/aside';
import { example } from './extension/example';
import { placeholder, segment as seg_placeholder } from './extension/placeholder';

export const segment: ExtensionParser.SegmentParser = validate(['~~~', '[$', '$'], validate(/^~{3,}|^\[?\$[A-Za-z-]\S+[^\S\n]*(?:$|\n)/, union([
  seg_fig,
  seg_figure,
  seg_table,
  seg_placeholder,
])));

export const extension: ExtensionParser = union([
  figbase,
  fig,
  figure,
  table,
  message,
  aside,
  example,
  placeholder,
]);
