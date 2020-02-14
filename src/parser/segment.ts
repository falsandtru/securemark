import { MarkdownParser } from '../../markdown';
import { union, some, exec } from '../combinator';
import { segment as codeblock } from './block/codeblock';
import { segment as mathblock } from './block/mathblock';
import { segment as extension } from './block/extension';
import { contentline, emptyline } from './source';
import { normalize } from './api/normalize';

import SegmentParser = MarkdownParser.SegmentParser;

const parser: SegmentParser = union([
  codeblock,
  mathblock,
  extension,
  some(contentline),
  some(emptyline),
]);

export function segment(source: string): string[] {
  assert(source === normalize(source));
  if (source.length > 1000 * 1000) return ['# ***Too large input over 1,000,000 characters***'];
  const segments: string[] = [];
  while (source !== '') {
    const rest = exec(parser(source, {}));
    assert(source.slice(1).endsWith(rest));
    // Limit the size of a segment not to block user operations
    // bacause of a long process caused by a huge segment.
    void segments.push(
      source.length - rest.length > 10 * 1000
        ? '# ***Too large block over 10,000 characters***'
        : source.slice(0, source.length - rest.length));
    source = rest;
  }
  assert(segments.join('') === arguments[0] || segments.some(seg => seg === '# ***Too large block over 10,000 characters***'));
  return segments;
}
