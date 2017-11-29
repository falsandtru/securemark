import { MarkdownParser } from '../../markdown.d';
import { combine, loop } from '../combinator';
import { pretext } from './block/pretext';
import { extension } from './block/extension';
import { nonemptyline } from './source/nonemptyline';
import { emptyline } from './source/emptyline';

import SegmentParser = MarkdownParser.SegmentParser;

export function segment(source: string): string[] {
  const segments: string[] = [];
  while (source.length > 0) {
    const [, rest = ''] = combine<HTMLElement | Text, SegmentParser.InnerParsers>([pretext, extension, loop(nonemptyline), loop(emptyline)])(source) || [[]];
    assert(source.slice(1).endsWith(rest));
    void segments.push(source.slice(0, source.length - rest.length));
    source = rest;
  }
  return segments;
}
