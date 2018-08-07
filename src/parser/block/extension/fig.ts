import { ExtensionParser } from '../../block';
import { union, sequence, some, rewrite, trimEnd } from '../../../combinator';
import { block } from '../../source/block';
import { line, contentline } from '../../source/line';
import { figure } from './figure';
import { segment as seg_pre } from '../pretext';
import { segment as seg_math } from '../math';
import { segment as seg_example } from '../extension/example';
import { label } from '../../inline';

import FigureParser = ExtensionParser.FigureParser;

export const segment: FigureParser = block(union([
  sequence([
    line(trimEnd(label), true, true),
    union([
      seg_pre,
      seg_math,
      seg_example,
      some(contentline),
    ]),
  ]),
  () => undefined,
]));

export const fig: FigureParser = block(rewrite(segment, source => {
  const bracket = (source.match(/^[^\n]*\n!?>+\s/) && source.match(/^~{3,}(?=\s*)$/gm) || [])
    .reduce((max, bracket) => bracket > max ? bracket : max, '~~') + '~';
  return figure(source.replace(/^([^\n]+)\n([\s\S]+?)\n?$/, `${bracket}figure $1\n$2\n${bracket}`));
}));
