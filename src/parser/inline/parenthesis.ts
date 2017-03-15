import { Result } from '../../parser';
import { ParenthesisParser, InlineParser, inline, squash } from '../inline';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { annotation } from './annotation';

type SubParsers = [InlineParser];

const syntax = /^\([\s\S]*?\)/;
const closer = /^\)/;

export const parenthesis: ParenthesisParser = function (source: string): Result<HTMLElement | Text, SubParsers> {
  if (!source.startsWith('(') || !source.match(syntax)) return;
  if (source.startsWith('((')) {
    const r = annotation(source);
    if (r) return r;
  }
  const [cs, rest] = source.startsWith('()')
    ? [[], source.slice(1)]
    : loop(combine<SubParsers, HTMLElement | Text>([inline]), closer)(source.slice(1)) || [[], ''];
  if (!rest.startsWith(')')) return;
  return [[...<Array<HTMLElement | Text>>Array.from(squash([<HTMLElement | Text>document.createTextNode('(')].concat(cs).concat([document.createTextNode(')')])).childNodes)], rest.slice(1)];
};
