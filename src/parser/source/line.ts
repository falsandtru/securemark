import { AnyLineParser, EmptyLineParser, EmptySegmentParser, ContentLineParser } from '../source';
import { Segment } from '../context';

export const anyline: AnyLineParser = (input, output) => {
  const { source, position } = input;
  if (position === source.length) return;
  input.position = source.indexOf('\n', position) + 1 || source.length;
  return output.context;
};

const regEmptyline = /[^\S\r\n]*(?:$|\r?\n)/y;
export const emptyline: EmptyLineParser = (input, output) => {
  const { source, position } = input;
  if (position === source.length) return;
  const i = eoel(source, position);
  if (i === position) return;
  input.position = i;
  return output.context;
};
export const emptysegment: EmptySegmentParser = (input, output) => {
  const { source, position, segment } = input;
  if (position === source.length) return;
  if (segment & Segment.write) {
    if (segment !== (Segment.empty | Segment.write)) return;
    input.position = source.length;
    return output.context;
  }
  const i = eoel(source, position);
  if (i === position) return;
  input.position = i;
  input.segment = Segment.empty;
  return output.context;
};
function eoel(source: string, position: number): number {
  const char = source[position];
  if (char === '\n' || char === '\r' && source[position + 1] === '\n') return position + 1;
  regEmptyline.lastIndex = position;
  regEmptyline.test(source);
  return regEmptyline.lastIndex || position;
}

const regContentline = /[^\S\r\n]*\S[^\r\n]*(?:$|\r?\n)/y;
export const contentline: ContentLineParser = (input, output) => {
  const { source, position } = input;
  if (position === source.length) return;
  const char = source[position];
  if (char === '\n' || char === '\r' && source[position + 1] === '\n') return;
  regContentline.lastIndex = position;
  regContentline.test(source);
  const i = regContentline.lastIndex;
  if (i === 0) return;
  input.position = i;
  return output.context;
};
