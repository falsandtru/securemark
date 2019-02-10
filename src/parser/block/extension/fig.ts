import { ExtensionParser } from '../../block';
import { union, sequence, some, block, line, rewrite } from '../../../combinator';
import { contentline } from '../../source/line';
import { figure } from './figure';
import { segment as seg_code } from '../codeblock';
import { segment as seg_math } from '../mathblock';
import { segment as seg_graph } from './graph';
import { segment as seg_example } from '../extension/example';
import { segment_ as seg_quote } from '../blockquote';
import { label } from '../../inline';

import FigureParser = ExtensionParser.FigureParser;

export const segment: FigureParser = block(
  sequence([
    line(label),
    union([
      seg_code,
      seg_math,
      seg_graph,
      seg_example,
      seg_quote,
      some(contentline),
    ]),
  ])) as any;

export const fig: FigureParser = block(rewrite(segment, source => {
  const bracket = (source.match(/^[^\n]*\n!?>+\s/) && source.match(/^~{3,}(?=\s*)$/gm) || [])
    .reduce((max, bracket) => bracket > max ? bracket : max, '~~') + '~';
  return figure(`${bracket}figure ${source}\n\n${bracket}`);
}));
