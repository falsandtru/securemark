import { ExtensionParser } from '../../block';
import { union, sequence, some, block, line, validate, rewrite, close, convert } from '../../../combinator';
import { contentline } from '../../source';
import { figure } from './figure';
import { segment as seg_label } from '../../inline/extension/label';
import { segment as seg_code } from '../codeblock';
import { segment as seg_math } from '../mathblock';
import { segment as seg_blockquote } from '../blockquote';
import { segment as seg_table } from './table';
import { segment as seg_placeholder } from './placeholder';

import FigParser = ExtensionParser.FigParser;

export const segment: FigParser.SegmentParser = block(validate(['[$', '$'],
  sequence([
    line(close(seg_label, /^(?=\s).*\n/)),
    union([
      seg_code,
      seg_math,
      seg_blockquote,
      seg_table,
      seg_placeholder,
      some(contentline),
    ]),
  ])));

export const fig: FigParser = block(rewrite(segment, convert(
  source => {
    const fence = (/^[^\n]*\n!?>+\s/.test(source) && source.match(/^~{3,}(?=[^\S\n]*$)/mg) || [])
      .reduce((max, fence) => fence > max ? fence : max, '~~') + '~';
    return `${fence}figure ${source}\n\n${fence}`;
  },
  union([figure]))));
