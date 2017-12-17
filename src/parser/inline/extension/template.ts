import { Result, loop, bracket } from '../../../combinator';
import { inline } from '../../inline';
import { squash } from '../../squash';
import { match, isSingleLine } from '../../source/validation';

const syntax = /^\[[~#:^\[][^\n]*?\]/;

export const template = <T extends Result<HTMLElement, never>>(parser: (flag: string, query: string, frag: DocumentFragment) => T): (source: string) => T => {
  return function (source: string): T {
    const [flag = '', query = '', frag = undefined, rest = ''] = parse(source) || [];
    if (!frag) return undefined as T;
    const result = parser(flag, query, frag);
    if (!result) return undefined as T;
    return [result[0], rest] as T;
  };
};

function parse(source: string): [string, string, DocumentFragment, string] | undefined {
  if (!match(source, '[', syntax)) return;
  const [ns = [], rest = undefined] = bracket(
    '[',
    loop(inline, /^[\]\n]/),
    ']',
  )(source) || [];
  if (rest === undefined) return;
  const text = source.slice(1, source.length - rest.length - 1);
  const flag = text[0];
  const query = text.slice(flag.length);
  if (!isSingleLine(query)) return;
  return [flag, query, squash(ns), rest];
}
