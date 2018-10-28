import { MarkdownParser } from '../../../markdown.d';
import { normalize } from './normalization';
import { exec, union, some } from '../../combinator';
import { segment as codeblock } from '../block/codeblock';
import { segment as mathblock } from '../block/mathblock';
import { segment as extension } from '../block/extension';
import { contentline, blankline } from '../source/line';

import SegmentParser = MarkdownParser.SegmentParser;

export function segment(source: string): string[] {
  assert(source === normalize(source));
  const segments: string[] = [];
  while (source.length > 0) {
    const result = union<SegmentParser>([
      codeblock,
      mathblock,
      extension,
      some(contentline),
      some(blankline)
    ])(source);
    const rest = exec(result);
    assert(source.slice(1).endsWith(rest));
    void segments.push(source.slice(0, source.length - rest.length));
    source = rest;
  }
  assert(segments.join('') === arguments[0]);
  return segments;
}
