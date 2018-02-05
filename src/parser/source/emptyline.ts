import { EmptyLineParser } from '../source';

const syntax = /^(?:[^\S\n]*(?:\n|$))*/;

export const emptylines: EmptyLineParser = source => {
  if (source.length === 0) return;
  const [whole = ''] = source.match(syntax) || [];
  return whole === ''
    ? undefined
    : [[], source.slice(whole.length)];
};
