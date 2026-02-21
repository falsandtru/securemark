import { AnyLineParser, EmptyLineParser, ContentLineParser } from '../source';

export const anyline: AnyLineParser = input => {
  const { context } = input;
  const { source, position } = context;
  context.position = source.indexOf('\n', position) + 1 || source.length;
  return [[]];
};
const regEmptyline = /[^\S\n]*(?:$|\n)/y;
export const emptyline: EmptyLineParser = input => {
  const { context } = input;
  const { source, position } = context;
  regEmptyline.lastIndex = position;
  regEmptyline.test(source);
  const i = regEmptyline.lastIndex;
  if (i === 0) return;
  context.position = i;
  return [[]];
};
const regContentline = /[^\S\n]*\S[^\n]*(?:$|\n)/y;
export const contentline: ContentLineParser = input => {
  const { context } = input;
  const { source, position } = context;
  regContentline.lastIndex = position;
  regContentline.test(source);
  const i = regContentline.lastIndex;
  if (i === 0) return;
  context.position = i;
  return [[]];
}
