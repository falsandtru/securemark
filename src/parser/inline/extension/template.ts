import { Result } from '../../../combinator/parser';
import { bracket } from '../../../combinator/bracket';
import { combine } from '../../../combinator/combine';
import { loop } from '../../../combinator/loop';
import { TextParser } from '../../source';
import { text } from '../../source/text';
import { squash } from '../../squash';

type SubParsers = [TextParser];

const syntax = /^\[[~#:^\[][^\s\[\]][^\n]*?\]/;

export const template = function <T extends Result<HTMLElement, any>>(parser: (flag: string, query: string) => T) {
  return function (source: string): T | undefined {
    const [flag, query, rest] = parse(source) || ['', '', ''];
    if (!flag) return;
    const result = parser(flag, query);
    if (!result) return;
    return [result[0], rest] as typeof result;
  };
};

function parse(source: string): [string, string, string] | undefined {
  if (!source.startsWith('[') || source.search(syntax) !== 0) return;
  const [cs, rest] = bracket('[', loop(combine<SubParsers, HTMLElement | Text>([text]), /^[\]\n]/), ']')(source) || [[], source];
  if (rest === source) return;
  const txt = squash(cs).textContent!;
  if (txt === '' || txt !== txt.trim()) return;
  return [txt[0], txt.slice(1), rest];
}
