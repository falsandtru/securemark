import { MarkdownParser } from '../../markdown';
import { Command } from './context';
import { clean, eval } from '../combinator/data/parser';
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
  some(contentline, MAX_SEGMENT_SIZE + 1),
  some(emptyline, MAX_SEGMENT_SIZE + 1),
]);

export function* segment(source: string): Generator<string, undefined, undefined> {
  if (!validate(source, MAX_INPUT_SIZE)) return yield `${Command.Error}Too large input over ${MAX_INPUT_SIZE.toLocaleString('en')} bytes.\n${source.slice(0, 1001)}`;
  assert(source.length < Number.MAX_SAFE_INTEGER);
  const context = {
    source,
    position: 0,
  };
  const input = { context };
  while (context.position < source.length) {
    const { position } = context;
    const result = parser(input)!;
    assert(result);
    assert(context.position > position);
    const segs = eval(result).length ? eval(result) : [source.slice(position, context.position)];
    assert(segs.join('') === source.slice(position, context.position));
    for (let i = 0; i < segs.length; ++i) {
      const seg = segs[i];
      validate(seg, MAX_SEGMENT_SIZE)
        ? yield seg
        : yield `${Command.Error}Too large segment over ${MAX_SEGMENT_SIZE.toLocaleString('en')} bytes.\n${seg}`
    }
    clean(context);
  }
}

export function validate(source: string, size: number): boolean {
  return source.length <= size / 4
      || source.length <= size && new Blob([source]).size <= size;
}
