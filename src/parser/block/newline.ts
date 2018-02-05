import { NewlineParser } from '../block';

const syntax = /^(?:[^\S\n]*?\\?\n)+/;

export const newline: NewlineParser = source => {
  const [whole = ''] = source.match(syntax) || [];
  if (!whole) return;
  return [[], source.slice(whole.length)];
};
