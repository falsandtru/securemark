import { MarkdownParser } from '../../markdown';
import { Input, Segment } from './context';
import { Output, List, Node, run } from '../combinator/parser';
import { union, some } from '../combinator';
import { segment as heading } from './block/heading';
import { segment as codeblock } from './block/codeblock';
import { segment as mathblock } from './block/mathblock';
import { segment as extension } from './block/extension';
import { contentline, emptysegment } from './source';

import SegmentParser = MarkdownParser.SegmentParser;

export const parser: SegmentParser = union([
  some(emptysegment),
  (input, output) => {
    const { source, position } = input;
    if (position === source.length) return;
    switch (source[position]) {
      case '`':
        if (source.startsWith('```', position)) return codeblock(input, output);
        break;
      case '~':
        if (source.startsWith('~~~', position)) return extension(input, output);
        break;
      case '$':
        if (source[position + 1] === '$') return mathblock(input, output);
        return extension(input, output);
      case '[':
        if (source[position + 1] === '$') return extension(input, output);
        break;
      case '#':
        return heading(input, output);
    }
  },
  some(contentline),
]);

export function* segment(source: string): Generator<readonly [string, Segment], undefined, undefined> {
  assert(source.length < Number.MAX_SAFE_INTEGER);
  const input = new Input({ source, segment: Segment.unknown });
  const output = new Output<string>();
  for (let position = 0, len = source.length; position < len;) {
    input.segment = Segment.unknown;
    for (const _ of run(parser, input, output));
    assert(~input.segment & Segment.write);
    assert(input.position > position);
    assert(output.data.length === 1);
    const result = new List<Node<string>>().import(output.peek());
    const segs = result.length === 0
      ? [source.slice(position, input.position)]
      : result.foldl<string[]>((acc, { value }) => (acc.push(value), acc), []);
    assert(segs.join('') === source.slice(position, input.position));
    position = input.position;
    for (let i = 0; i < segs.length; ++i) {
      const seg = segs[i];
      yield [seg, input.segment];
    }
  }
}
