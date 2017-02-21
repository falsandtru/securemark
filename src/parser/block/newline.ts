import { Result } from '../../parser';
import { NewlineParser } from '../block';

const syntax = /^(\s*?\n)/;

export const newline: NewlineParser = function (source: string): Result<never, never> {
  const [whole, first] = source.match(syntax) || ['', ''];
  if (!whole) return;
  return [[], source.slice(first.length)];
};
