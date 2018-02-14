import { MarkdownParser } from '../../markdown.d';
import { combine } from '../combinator';
import { pretext } from './block/pretext';
import { extension } from './block/extension';
import { nonemptylines } from './source/nonemptyline';
import { emptylines } from './source/emptyline';

import SegmentParser = MarkdownParser.SegmentParser;

export function segment(source: string): string[] {
  const segments: string[] = [];
  while (source.length > 0) {
    const [, rest = ''] = combine<SegmentParser>([pretext, extension, nonemptylines, emptylines])(source) || [];
    assert(source.slice(1).endsWith(rest));
    void segments.push(source.slice(0, source.length - rest.length));
    source = rest;
  }
  return segments;
}
