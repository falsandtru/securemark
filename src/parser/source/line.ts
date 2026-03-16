import { AnyLineParser, EmptyLineParser, EmptySegmentParser, ContentLineParser } from '../source';
import { Segment } from '../context';
import { List } from '../../combinator/data/parser';

export const anyline: AnyLineParser = input => {
  const context = input;
  const { source, position } = context;
  if (position === source.length) return;
  context.position = source.indexOf('\n', position) + 1 || source.length;
  return new List();
};

const regEmptyline = /[^\S\n]*(?:$|\n)/y;
export const emptyline: EmptyLineParser = input => {
  const context = input;
  const { source, position } = context;
  if (position === source.length) return;
  const i = eoel(source, position);
  if (i === position) return;
  context.position = i;
  return new List();
};
export const emptysegment: EmptySegmentParser = input => {
  const context = input;
  const { source, position, segment } = context;
  if (position === source.length) return;
  if (segment & Segment.write) {
    if (segment !== (Segment.empty | Segment.write)) return;
    context.position = source.length;
    return new List();
  }
  const i = eoel(source, position);
  if (i === position) return;
  context.position = i;
  context.segment = Segment.empty;
  return new List();
};
function eoel(source: string, position: number): number {
  if (source[position] === '\n') return position + 1;
  regEmptyline.lastIndex = position;
  regEmptyline.test(source);
  return regEmptyline.lastIndex || position;
}

const regContentline = /[^\S\n]*\S[^\n]*(?:$|\n)/y;
export const contentline: ContentLineParser = input => {
  const context = input;
  const { source, position } = context;
  if (position === source.length) return;
  if (source[position] === '\n') return;
  regContentline.lastIndex = position;
  regContentline.test(source);
  const i = regContentline.lastIndex;
  if (i === 0) return;
  context.position = i;
  return new List();
};
