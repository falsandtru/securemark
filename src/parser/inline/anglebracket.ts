import { Result } from '../../combinator/parser';
import { bracket } from '../../combinator/bracket';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { AngleBracketParser, InlineParser, inline } from '../inline';
import { squash } from '../squash';

type SubParsers = [InlineParser];

const syntax = /^<[\s\S]*?>/;
const closer = /^>/;

export const anglebracket: AngleBracketParser = function (source: string): Result<HTMLElement | Text, SubParsers> {
  if (!source.startsWith('<') || source.search(syntax) !== 0) return;
  const [cs, rest] = bracket('<', loop(combine<SubParsers, HTMLElement | Text>([inline]), closer), '>')(source) || [[], source];
  if (rest === source) return;
  return [[...squash([document.createTextNode('<'), ...cs, document.createTextNode('>')]).childNodes] as Array<HTMLElement | Text>, rest];
};
