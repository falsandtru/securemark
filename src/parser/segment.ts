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

const MAX_INPUT_SIZE = 100_000 * 10; // == 100,000 bytes (Max value size of FDB) * 10
export const MAX_SEGMENT_LENGTH = 100 * 1000;

const parser: SegmentParser = union([
  heading,
  codeblock,
  mathblock,
  extension,
  some(contentline, MAX_SEGMENT_LENGTH),
  some(emptyline, MAX_SEGMENT_LENGTH),
]);

export function* segment(source: string): Generator<string, undefined, undefined> {
  if (!validate(source)) return yield `\0Too large input over ${MAX_INPUT_SIZE.toLocaleString('en')} bytes.\n${source.slice(0, 1001)}`;
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
      seg.length > MAX_SEGMENT_LENGTH
        ? yield `\0Too large segment over ${MAX_SEGMENT_LENGTH.toLocaleString('en')} in length.\n${seg}`
        : yield seg;
    }
    source = rest;
  }
}

function validate(source: string): boolean {
  return source.length <= MAX_INPUT_SIZE
      && new Blob([source]).size <= MAX_INPUT_SIZE;
}

export function prepare(source: string): string {
  return validate(source)
    ? source
    : source.slice(0, MAX_INPUT_SIZE + 1);
}
