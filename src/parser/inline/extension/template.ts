import { TextParser } from '../../source';
import { Result, combine, loop, bracket } from '../../../combinator';
import { text } from '../../source/text';
import { squash } from '../../squash';
import { match, isTightVisible, isSingleLine } from '../../source/validation';

const syntax = /^\[[~#:^\[][^\s\[\]][^\n]*?\]/;

export const template = <T extends Result<HTMLElement, never>>(parser: (flag: string, query: string) => T): (source: string) => T => {
  return function (source: string): T {
    const [flag, query, rest] = parse(source) || ['', '', ''];
    if (!flag) return undefined as T;
    const result = parser(flag, query);
    if (!result) return undefined as T;
    return [result[0], rest] as T;
  };
};

function parse(source: string): [string, string, string] | undefined {
  if (!match(source, '[', syntax)) return;
  const [cs, rest = undefined] = bracket(
    '[',
    loop(combine<HTMLElement | Text, [TextParser]>([text]), /^[\]\n]/),
    ']',
  )(source) || [[]];
  if (rest === undefined) return;
  const txt = squash(cs).textContent!;
  if (!isTightVisible(txt)) return;
  if (!isSingleLine(txt)) return;
  return [txt[0], txt.slice(1), rest];
}
