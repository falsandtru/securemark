import { Result } from '../../combinator/parser';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { BracketParser, InlineParser, inline } from '../inline';
import { squash } from '../squash';

type SubParsers = [InlineParser];

const syntax = /^\[[\s\S]*?\]/;
const closer = /^\]/;

export const bracket: BracketParser = function (source: string): Result<HTMLElement | Text, SubParsers> {
  if (!source.startsWith('[') || source.search(syntax) !== 0) return;
  const [[, ...cs], rest] = loop(combine<SubParsers, HTMLElement | Text>([inline]), closer)(` ${source.slice(1)}`) || [[], ''];
  if (!rest.startsWith(']')) return;
  return [<Array<HTMLElement | Text>>Array.from(squash([<HTMLElement | Text>document.createTextNode('[')].concat(cs).concat([document.createTextNode(']')])).childNodes), rest.slice(1)];
};
