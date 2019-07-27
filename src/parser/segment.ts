import { MarkdownParser } from '../../markdown';
import { normalize } from './api/normalization';
import { union, some, exec } from '../combinator';
import { segment as codeblock } from './block/codeblock';
import { segment as mathblock } from './block/mathblock';
import { segment as extension } from './block/extension';
import { contentline, blankline } from './source';

import SegmentParser = MarkdownParser.SegmentParser;

const parser: SegmentParser = union<SegmentParser>([
  codeblock,
  mathblock,
  extension,
  some(contentline),
  some(blankline),
]);

export function segment(source: string): string[] {
  assert(source === normalize(source));
  const segments: string[] = [];
  while (source !== '') {
    const rest = exec(parser(source));
    assert(source.slice(1).endsWith(rest));
    void segments.push(source.slice(0, source.length - rest.length));
    source = rest;
  }
  assert(segments.join('') === arguments[0]);
  return segments;
}
