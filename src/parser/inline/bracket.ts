import { BracketParser, inline } from '../inline';
import { combine, loop, bracket as brkt } from '../../combinator';
import { squash } from '../squash';
import { validate } from '../source/validation';

const syntax = /^\[[\s\S]*?\]/;
const closer = /^\]/;

export const bracket: BracketParser = function (source: string): [(HTMLElement | Text)[], string] | undefined {
  if (!validate(source, '[', syntax)) return;
  const [cs, rest] = brkt('[', loop(combine<HTMLElement | Text, BracketParser.InnerParsers>([inline]), closer), ']')(source) || [[], source];
  if (rest === source) return;
  return [[...squash([document.createTextNode('['), ...cs, document.createTextNode(']')]).childNodes] as Array<HTMLElement | Text>, rest];
};
