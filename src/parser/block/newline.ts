import { Result } from '../../combinator';
import { NewlineParser } from '../block';

const syntax = /^[^\S\n]*\n/;

export const newline: NewlineParser = function (source: string): Result<never, never> {
  const [whole] = source.match(syntax) || [''];
  if (!whole) return;
  return [[], source.slice(whole.length)];
};
