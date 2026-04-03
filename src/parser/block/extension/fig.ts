import { ExtensionParser } from '../../block';
import { Segment } from '../../context';
import { Result } from '../../../combinator/parser';
import { union, sequence, some, always, backtrack, block, line, rewrite, close } from '../../../combinator';
import { contentline } from '../../source';
import { figure } from './figure';
import { segment as seg_label } from '../../inline/extension/label';
import { segment as seg_code } from '../codeblock';
import { segment as seg_math } from '../mathblock';
import { segment as seg_table } from './table';
import { segment as seg_blockquote } from '../blockquote';
import { segment as seg_placeholder } from './placeholder';

import FigParser = ExtensionParser.FigParser;

export const segment: FigParser.SegmentParser = backtrack(block(
  sequence([
    line(close(seg_label, /(?!\S)[^\r\n]*\r?\n/y), false),
    union([
      seg_code,
      seg_math,
      seg_table,
      seg_blockquote,
      seg_placeholder,
      some(contentline),
    ]),
  ]), true, Segment.fig));

export const fig: FigParser = block(rewrite(segment, always([
  (input, output) => {
    const { source } = input;
    // Bug: TypeScript
    const fence = (/^[^\r\n]*\r?\n!?>+ /.test(source) && source.match(/^~{3,}(?=[^\S\r\n]*$)/gm) as string[] || [])
      .reduce((max, fence) => fence > max ? fence : max, '~~') + '~';
    const src = `${fence}figure ${source.replace(/^([^\r\n]+\r?\n![[{0-9a-z][^\r\n]+\r?\n)(.+?)\r?\n?$/s, '$1\n$2')}\n${fence}`;
    input = input.scope.push(src);
    input.segment = Segment.figure | Segment.write;
    return output.context;
  },
  union([figure]),
  (input, output) => {
    input.scope.pop();
    return output.peek().last!.value.tagName === 'FIGURE'
      ? output.context
      : Result.fail;
  },
])));
