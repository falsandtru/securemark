import { MarkdownParser } from '../../markdown';
import { Command } from './context';
import { eval, exec } from '../combinator/data/parser';
import { union, some } from '../combinator';
import { segment as heading } from './block/heading';
import { segment as codeblock } from './block/codeblock';
import { segment as mathblock } from './block/mathblock';
import { segment as extension } from './block/extension';
import { contentline, emptyline } from './source';

import SegmentParser = MarkdownParser.SegmentParser;

export const MAX_SEGMENT_SIZE = 100_000; // 100,000 bytes (Max value size of FDB)
export const MAX_INPUT_SIZE = MAX_SEGMENT_SIZE * 10;

const parser: SegmentParser = union([
  heading,
  codeblock,
  mathblock,
  extension,
  some(contentline, MAX_SEGMENT_SIZE * 2),
  some(emptyline, MAX_SEGMENT_SIZE * 2),
]);

export function* segment(source: string): Generator<string, undefined, undefined> {
  if (!validate(source, MAX_INPUT_SIZE)) return yield `${Command.Error}Too large input over ${MAX_INPUT_SIZE.toLocaleString('en')} bytes.\n${source.slice(0, 1001)}`;
  assert(source.length < Number.MAX_SAFE_INTEGER);
  while (source !== '') {
    const result = parser({ source, context: {} })!;
    assert(result);
    const rest = exec(result);
    const segs = eval(result).length ? eval(result) : [source.slice(0, source.length - rest.length)];
    assert(source.slice(1).endsWith(rest));
    assert(segs.join('') === source.slice(0, source.length - rest.length));
    for (let i = 0; i < segs.length; ++i) {
      const seg = segs[i];
      validate(seg, MAX_SEGMENT_SIZE)
        ? yield seg
        : yield `${Command.Error}Too large segment over ${MAX_SEGMENT_SIZE.toLocaleString('en')} bytes.\n${seg}`
    }
    source = rest;
  }
}

export function validate(source: string, size: number): boolean {
  return source.length <= size / 4
      || source.length <= size && new Blob([source]).size <= size;
}
