import { MarkdownParser } from '../../markdown';
import { union, some, eval, exec } from '../combinator';
import { segment as heading } from './block/heading';
import { segment as codeblock } from './block/codeblock';
import { segment as mathblock } from './block/mathblock';
import { segment as extension } from './block/extension';
import { contentline, emptyline } from './source';
import { uuid } from 'spica/uuid';

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
  if (source.length > 1000 * 1000) return yield `# ***Too large input over 1,000,000 characters.*** [#error:${uuid()}]`;
  assert(source.length < Number.MAX_SAFE_INTEGER);
  while (source !== '') {
    const result = parser(source, {})!;
    assert(result);
    const rest = exec(result);
    const segs = eval(result).length ? eval(result) : [source.slice(0, source.length - rest.length)];
    assert(source.slice(1).endsWith(rest));
    assert(segs.join('') === source.slice(0, source.length - rest.length));
    for (let i = 0; i < segs.length; ++i) {
      const seg = segs[i];
      // Limit the size of a segment not to block user operations
      // bacause of a long process caused by a huge segment.
      seg.length > 10 * 1000
        ? yield `# ***Too large block over 10,000 characters.*** [#error:${uuid()}]`
        : yield seg;
    }
    source = rest;
  }
}
