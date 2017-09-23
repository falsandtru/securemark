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
  return [[...squash([document.createTextNode('['), ...cs, document.createTextNode(']')]).childNodes] as Array<HTMLElement | Text>, rest.slice(1)];
};
