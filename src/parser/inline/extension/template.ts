import { Result } from '../../../combinator/parser';
import { combine } from '../../../combinator/combine';
import { loop } from '../../../combinator/loop';
import { TextParser } from '../../source';
import { text } from '../../source/text';
import { squash } from '../../squash';
import { Cache } from 'spica/cache';

type SubParsers = [TextParser];

const syntax = /^\[[#:][^\s\[\]][^\n]*?\]/;

export const template = function <T extends Result<HTMLElement, any>>(parser: (flag: string, query: string) => T) {
  return function (source: string): T | undefined {
    const [flag, query, rest] = parse(source) || ['', '', ''];
    if (!flag) return;
    const result = parser(flag, query);
    if (!result) return;
    return [result[0], rest] as typeof result;
  };
};

const cache = new Cache<string, [string, string, string] | undefined>(9);

function parse(source: string): [string, string, string] | undefined {
  if (!source.startsWith('[') || source.search(syntax) !== 0) return;
  if (cache.has(source)) return cache.get(source);
  void cache.set(source, void 0);
  const [[, ...cs], rest] = loop(combine<SubParsers, HTMLElement | Text>([text]), /^[\]\n]/)(source) || [[], source];
  if (!rest.startsWith(']')) return;
  const txt = squash(cs).textContent!;
  if (txt === '' || txt !== txt.trim()) return;
  assert(cache.has(source));
  return cache.set(source, [txt[0], txt.slice(1), rest.slice(1)]);
}
