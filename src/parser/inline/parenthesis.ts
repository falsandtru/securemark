﻿import { Result } from '../../parser';
import { ParenthesisParser, InlineParser, inline, squash } from '../inline';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';

type SubParsers = [InlineParser];

const syntax = /^\([\s\S]*?\)/;
const closer = /^\)/;

export const parenthesis: ParenthesisParser = function (source: string): Result<HTMLElement | Text, SubParsers> {
  if (!source.startsWith('(') || source.search(syntax) !== 0) return;
  const [[, ...cs], rest] = loop(combine<SubParsers, HTMLElement | Text>([inline]), closer)(` ${source.slice(1)}`) || [[], ''];
  if (!rest.startsWith(')')) return;
  return [<Array<HTMLElement | Text>>Array.from(squash([<HTMLElement | Text>document.createTextNode('(')].concat(cs).concat([document.createTextNode(')')])).childNodes), rest.slice(1)];
};
