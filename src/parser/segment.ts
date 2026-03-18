import { MarkdownParser } from '../../markdown';
import { MAX_INPUT_SIZE, MAX_SEGMENT_SIZE, Context, Segment, Command } from './context';
import { union, some } from '../combinator';
import { segment as heading } from './block/heading';
import { segment as codeblock } from './block/codeblock';
import { segment as mathblock } from './block/mathblock';
import { segment as extension } from './block/extension';
import { contentline, emptysegment } from './source';
import { normalize } from './api';

import SegmentParser = MarkdownParser.SegmentParser;

const parser: SegmentParser = union([
  some(emptysegment, MAX_SEGMENT_SIZE + 1),
  input => {
    const { source, position } = input;
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
        return extension(input);
      case '[':
        if (source[position + 1] === '$') return extension(input);
        break;
      case '#':
        return heading(input);
    }
  },
  some(contentline, MAX_SEGMENT_SIZE + 1),
]);

export function* segment(source: string, initial = true): Generator<readonly [string, Segment], undefined, undefined> {
  if (initial && !validate(source, MAX_INPUT_SIZE)) return yield [`${Command.Error}Too large input over ${MAX_INPUT_SIZE.toLocaleString('en')} bytes.\n${source.slice(0, 1001)}`, Segment.unknown];
  assert(source.length < Number.MAX_SAFE_INTEGER);
  for (let position = 0, len = source.length; position < len;) {
    const context = new Context({ source, position });
    const result = parser(context)!;
    assert(result);
    assert(context.position > position);
    const segs = result.length === 0
      ? [source.slice(position, context.position)]
      : result.foldl<string[]>((acc, { value }) => (acc.push(value), acc), []);
    assert(segs.join('') === source.slice(position, context.position));
    position = context.position;
    for (let i = 0; i < segs.length; ++i) {
      const seg = segs[i];
      initial && !validate(seg, MAX_SEGMENT_SIZE)
        ? yield [`${Command.Error}Too large segment over ${MAX_SEGMENT_SIZE.toLocaleString('en')} bytes.\n${seg}`, Segment.unknown]
        : yield [initial ? normalize(seg) : seg, context.segment];
    }
  }
}

function validate(source: string, size: number): boolean {
  return source.length <= size / 2
      || source.length <= size && new Blob([source]).size <= size;
}
