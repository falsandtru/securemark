import { MarkdownParser } from '../../markdown';
import { union, some, eval, exec } from '../combinator';
import { segment as heading } from './block/heading';
import { segment as codeblock } from './block/codeblock';
import { segment as mathblock } from './block/mathblock';
import { segment as extension } from './block/extension';
import { contentline, emptyline } from './source';

import SegmentParser = MarkdownParser.SegmentParser;

const parser: SegmentParser = union([
  heading,
  codeblock,
  mathblock,
  extension,
  some(contentline),
  some(emptyline),
]);

export function* segment(source: string): Generator<string, undefined, undefined> {
  if (source.length > 1000 * 1000) return yield '# ***Too large input over 1,000,000 characters***';
  assert(source.length < Number.MAX_SAFE_INTEGER);
  while (source !== '') {
    const r = parser(source, {})!;
    assert(r);
    const segs = eval(r);
    const rest = exec(r);
    assert(segs.length === 0 || segs.join('') === source.slice(0, source.length - rest.length));
    assert(source.slice(1).endsWith(rest));
    // Limit the size of a segment not to block user operations
    // bacause of a long process caused by a huge segment.
    source.length - rest.length > 10 * 1000
      ? yield '# ***Too large block over 10,000 characters***'
      : segs.length === 0
        ? yield source.slice(0, source.length - rest.length)
        : yield* segs;
    source = rest;
  }
}
