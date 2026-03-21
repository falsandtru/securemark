import { ExtensionParser } from '../../block';
import { Segment } from '../../context';
import { union, sequence, some, block, line, verify, rewrite, close, convert } from '../../../combinator';
import { contentline } from '../../source';
import { figure } from './figure';
import { segment as seg_label } from '../../inline/extension/label';
import { segment as seg_code } from '../codeblock';
import { segment as seg_math } from '../mathblock';
import { segment as seg_table } from './table';
import { segment as seg_blockquote } from '../blockquote';
import { segment as seg_placeholder } from './placeholder';

import FigParser = ExtensionParser.FigParser;

export const segment: FigParser.SegmentParser = block(
  sequence([
    line(close(seg_label, /(?!\S)[^\r\n]*\r?\n/y)),
    union([
      seg_code,
      seg_math,
      seg_table,
      seg_blockquote,
      seg_placeholder,
      some(contentline),
    ]),
  ]), true, Segment.fig);

export const fig: FigParser = block(rewrite(segment, verify(convert(
  (source, context) => {
    // Bug: TypeScript
    const fence = (/^[^\r\n]*\r?\n!?>+ /.test(source) && source.match(/^~{3,}(?=[^\S\r\n]*$)/gm) as string[] || [])
      .reduce((max, fence) => fence > max ? fence : max, '~~') + '~';
    context.segment = Segment.figure | Segment.write;
    return `${fence}figure ${source.replace(/^([^\r\n]+\r?\n!https?:[^\r\n]+\r?\n)(.+?)\r?\n?$/s, '$1\n$2')}\n${fence}`;
  },
  union([figure])),
  ([{ value: el }]) => el.tagName === 'FIGURE')));
