import { Result, combine, loop, bracket as brkt } from '../../combinator';
import { BracketParser, InlineParser, inline } from '../inline';
import { squash } from '../squash';
import { validate } from '../source/validation';

type SubParsers = [InlineParser];

const syntax = /^\[[\s\S]*?\]/;
const closer = /^\]/;

export const bracket: BracketParser = function (source: string): Result<HTMLElement | Text, SubParsers> {
  if (!validate(source, '[', syntax)) return;
  const [cs, rest] = brkt('[', loop(combine<SubParsers, HTMLElement | Text>([inline]), closer), ']')(source) || [[], source];
  if (rest === source) return;
  return [[...squash([document.createTextNode('['), ...cs, document.createTextNode(']')]).childNodes] as Array<HTMLElement | Text>, rest];
};
