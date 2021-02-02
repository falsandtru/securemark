import { Blob } from 'spica/global';
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

const INPUT_SIZE_LIMIT = 1000 ** 2;
const SEGMENT_SIZE_LIMIT = 10 * 1000;

export function* segment(source: string): Generator<string, undefined, undefined> {
  assert(!source.includes('\0'));
  if (new Blob([source]).size > INPUT_SIZE_LIMIT) return yield `\0Too large input over ${INPUT_SIZE_LIMIT.toLocaleString('en-US')} bytes.\n${source.slice(0, 10001)}`;
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
      seg.length > SEGMENT_SIZE_LIMIT
        ? yield `\0Too large segment over ${SEGMENT_SIZE_LIMIT.toLocaleString('en-US')} in length.\n${seg}`
        : yield seg;
    }
    source = rest;
  }
}
