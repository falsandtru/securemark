import { InlineParser, inline } from '../../inline';
import { Result, combine, loop, bracket } from '../../../combinator';
import { match, isSingleLine } from '../../source/validation';

const syntax = /^\[[~#:^\[][^\n]*?\]/;

export const template = <T extends Result<HTMLElement, never>>(parser: (flag: string, query: string) => T): (source: string) => T => {
  return function (source: string): T {
    const [flag = '', query = '', rest = ''] = parse(source) || [];
    if (!flag) return undefined as T;
    const result = parser(flag, query);
    if (!result) return undefined as T;
    return [result[0], rest] as T;
  };
};

function parse(source: string): [string, string, string] | undefined {
  if (!match(source, '[', syntax)) return;
  const [, rest = undefined] = bracket(
    '[',
    loop(combine<HTMLElement | Text, [InlineParser]>([inline]), /^[\]\n]/),
    ']',
  )(source) || [];
  if (rest === undefined) return;
  const text = source.slice(1, source.length - rest.length - 1);
  const flag = text[0];
  const query = text.slice(flag.length);
  if (!isSingleLine(query)) return;
  return [flag, query, rest];
}
