import { Blob } from 'spica/global';
import { MarkdownParser } from '../../markdown';
import { eval, exec } from '../combinator/data/parser';
import { union, some } from '../combinator';
import { segment as heading } from './block/heading';
import { segment as codeblock } from './block/codeblock';
import { segment as mathblock } from './block/mathblock';
import { segment as extension } from './block/extension';
import { contentline, emptyline } from './source';

import SegmentParser = MarkdownParser.SegmentParser;

const INPUT_SIZE_LIMIT = 1000 ** 2;
export const SEGMENT_LENGTH_LIMIT = 100 * 1000;

const parser: SegmentParser = union([
  heading,
  codeblock,
  mathblock,
  extension,
  some(contentline, SEGMENT_LENGTH_LIMIT),
  some(emptyline, SEGMENT_LENGTH_LIMIT),
]);

export function* segment(source: string): Generator<string, undefined, undefined> {
  if (new Blob([source]).size > INPUT_SIZE_LIMIT) return yield `\0Too large input over ${INPUT_SIZE_LIMIT.toLocaleString('en')} bytes.\n${source.slice(0, 1001)}`;
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
      seg.length > SEGMENT_LENGTH_LIMIT
        ? yield `\0Too large segment over ${SEGMENT_LENGTH_LIMIT.toLocaleString('en')} in length.\n${seg}`
        : yield seg;
    }
    source = rest;
  }
}

export function prepare(source: string): string {
  const seg = segment(source).next().value;
  return seg?.startsWith('\0Too large input')
    ? source.slice(0, INPUT_SIZE_LIMIT + 1)
    : source;
}
