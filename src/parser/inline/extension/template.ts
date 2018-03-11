import { Result, some, surround } from '../../../combinator';
import { line } from '../../source/line';
import { match } from '../../source/validation';
import { inline } from '../../inline';

const syntax = /^\[[~#:^\[][^\n]*?\]/;

export const template = <T extends Result<HTMLElement, never>>(flag: string, parser: (query: string, flag: string) => T): (source: string) => T => {
  return function (source: string): T {
    const [query = '', rest = ''] = parse(flag, source) || [];
    if (query === '') return undefined as T;
    const result = parser(query, source[1]);
    if (!result) return undefined as T;
    return [result[0], rest] as T;
  };
};

function parse(flag: string, source: string): [string, string] | undefined {
  if (!match(source, `[${flag}`, syntax)) return;
  const [, rest = undefined] = line(surround('[', some(inline, /^\]/), ']'), false)(source) || [];
  if (rest === undefined) return;
  const text = source.slice(1, source.length - rest.length - 1);
  assert(text.startsWith(flag));
  const query = text.slice(flag.length || 1);
  return [query, rest];
}
