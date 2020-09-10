import { ExtensionParser } from '../../block';
import { union, sequence, some, block, line, rewrite, convert } from '../../../combinator';
import { contentline } from '../../source';
import { figure } from './figure';
import { segment as seg_label } from '../../inline/extension/label';
import { segment as seg_code } from '../codeblock';
import { segment as seg_math } from '../mathblock';
import { segment as seg_example } from '../extension/example';
import { segment as seg_blockquote } from '../blockquote';

import FigParser = ExtensionParser.FigParser;

export const segment: FigParser.SegmentParser = block(
  sequence([
    line(seg_label),
    union([
      seg_code,
      seg_math,
      seg_example,
      seg_blockquote,
      some(contentline),
    ]),
  ]));

export const fig: FigParser = block(rewrite(segment, convert(
  source => {
    const fence = (/^[^\n]*\n!?>+\s/.test(source) && source.match(/^~{3,}(?=\s*$)/gm) || [])
      .reduce((max, fence) => fence > max ? fence : max, '~~') + '~';
    return `${fence}figure ${source}\n\n${fence}`;
  },
  union([figure]))));
