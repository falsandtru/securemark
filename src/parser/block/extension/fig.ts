import { ExtensionParser } from '../../block';
import { union, sequence, some, block, line, validate, verify, rewrite, close, convert } from '../../../combinator';
import { contentline } from '../../source';
import { figure } from './figure';
import { segment as seg_label } from '../../inline/extension/label';
import { segment as seg_code } from '../codeblock';
import { segment as seg_math } from '../mathblock';
import { segment as seg_table } from './table';
import { segment as seg_blockquote } from '../blockquote';
import { segment as seg_placeholder } from './placeholder';
import { media, shortmedia } from '../../inline';

import FigParser = ExtensionParser.FigParser;

export const segment: FigParser.SegmentParser = block(validate(['[$', '$'],
  sequence([
    line(close(seg_label, /^(?=\s).*\n/)),
    union([
      seg_code,
      seg_math,
      seg_table,
      seg_blockquote,
      seg_placeholder,
      some(contentline),
    ]),
  ])));

export const fig: FigParser = block(rewrite(segment, verify(convert(
  (source, context) => {
    // Bug: TypeScript
    const fence = (/^[^\n]*\n!?>+\s/.test(source) && source.match(/^~{3,}(?=[^\S\n]*$)/mg) as string[] || [])
      .reduce((max, fence) => fence > max ? fence : max, '~~') + '~';
    return parser({ source, context })
      ? `${fence}figure ${source.replace(/^(.+\n.+\n)([\S\s]+?)\n?$/, '$1\n$2')}\n${fence}`
      : `${fence}figure ${source}\n\n${fence}`;
  },
  union([figure])),
  ([el]) => el.tagName === 'FIGURE')));

const parser = sequence([
  line(close(seg_label, /^(?=\s).*\n/)),
  line(union([
    media,
    shortmedia,
  ])),
  some(contentline),
]);
