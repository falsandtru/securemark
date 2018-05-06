import { MarkdownParser } from '../../markdown.d';
import { union, some } from '../combinator';
import { segment as pretext } from './block/pretext';
import { extension } from './block/extension';
import { contentline, blankline } from './source/line';

import SegmentParser = MarkdownParser.SegmentParser;

export function segment(source: string): string[] {
  const segments: string[] = [];
  while (source.length > 0) {
    const [, rest = ''] = union<SegmentParser>([
      pretext,
      extension,
      some(contentline),
      some(blankline)
    ])(source) || [];
    assert(source.slice(1).endsWith(rest));
    void segments.push(source.slice(0, source.length - rest.length));
    source = rest;
  }
  return segments;
}
