import { AnyLineParser, EmptyLineParser, ContentLineParser } from '../source';
import { List } from '../../combinator/data/parser';

export const anyline: AnyLineParser = input => {
  const { context } = input;
  const { source, position } = context;
  if (position === source.length) return;
  context.position = source.indexOf('\n', position) + 1 || source.length;
  return new List();
};

const regEmptyline = /[^\S\n]*(?:$|\n)/y;
export const emptyline: EmptyLineParser = input => {
  const { context } = input;
  const { source, position } = context;
  if (position === source.length) return;
  if (source[position] === '\n') return ++context.position, new List();
  regEmptyline.lastIndex = position;
  regEmptyline.test(source);
  const i = regEmptyline.lastIndex;
  if (i === 0) return;
  context.position = i;
  return new List();
};

const regContentline = /[^\S\n]*\S[^\n]*(?:$|\n)/y;
export const contentline: ContentLineParser = input => {
  const { context } = input;
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
