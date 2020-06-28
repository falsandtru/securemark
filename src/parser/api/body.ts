import { undefined } from 'spica/global';
import { exec } from '../../combinator/data/parser';
import { header } from '../header';

export function body(source: string): string {
  const rest = exec(header(source, {}));
  assert(source.endsWith(rest || ''));
  return rest !== undefined
    ? rest.replace(/^[^\S\n]*\n?/, '')
    : source;
}
