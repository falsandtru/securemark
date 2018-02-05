import { NonemptyLineParser } from '../source';

const syntax = /^(?:[^\S\n]*?\S[^\n]*(?:\n|$))*/;

export const nonemptylines: NonemptyLineParser = source => {
  if (source.length === 0) return;
  const [whole = ''] = source.match(syntax) || [];
  return whole === ''
    ? undefined
    : [[], source.slice(whole.length)];
};
