import { MarkdownParser } from '../../markdown';
import { Command } from './context';
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
  some(emptyline),
  input => {
    const { context: { source, position } } = input;
    if (position === source.length) return;
    switch (source[position]) {
      case '`':
        if (source.startsWith('```', position)) return codeblock(input);
        break;
      case '~':
        if (source.startsWith('~~~', position)) return extension(input);
        break;
      case '$':
        if (source[position + 1] === '$') return mathblock(input);
        break;
      case '[':
        if (source[position + 1] === '$') return extension(input);
        break;
      case '#':
        return heading(input);
      case '$':
        return extension(input);
    }
  },
  some(contentline),
]) as any;

export function* segment(source: string): Generator<string, undefined, undefined> {
  if (!validate(source, MAX_INPUT_SIZE)) return yield `${Command.Error}Too large input over ${MAX_INPUT_SIZE.toLocaleString('en')} bytes.\n${source.slice(0, 1001)}`;
  assert(source.length < Number.MAX_SAFE_INTEGER);
  for (let position = 0; position < source.length;) {
    const context = { source, position };
    const result = parser({ context })!;
    assert(result);
    assert(context.position > position);
    const segs = result.length > 0
      ? result.foldl<string[]>((acc, { value }) => void acc.push(value) || acc, [])
      : [source.slice(position, context.position)];
    assert(segs.join('') === source.slice(position, context.position));
    for (let i = 0; i < segs.length; ++i) {
      const seg = segs[i];
      validate(seg, MAX_SEGMENT_SIZE)
        ? yield seg
        : yield `${Command.Error}Too large segment over ${MAX_SEGMENT_SIZE.toLocaleString('en')} bytes.\n${seg}`
    }
    position = context.position;
  }
}

export function validate(source: string, size: number): boolean {
  return source.length <= size / 4
      || source.length <= size && new Blob([source]).size <= size;
}
