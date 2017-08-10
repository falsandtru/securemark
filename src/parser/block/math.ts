import { Result } from '../../combinator/parser';
import { MathBlockParser, consumeBlockEndEmptyLine } from '../block';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { MathTextParser, squash } from '../text';
import { mathtext } from '../text/mathtext';

type SubParsers = [MathTextParser];

const syntax = /^\$\$[^\S\n]*\n(?:[^\n]*?\S[^\n]*\n)+?\$\$[^\S\n]*(?=\n|$)/;
const closer = /^\n\$\$[^\S\n]*(?=\n|$)/;

export const math: MathBlockParser = function (source: string): Result<HTMLDivElement, SubParsers> {
  if (!source.startsWith('$$') || source.search(syntax) !== 0) return;
  const [[, ...cs], rest] = loop(combine<SubParsers, Text>([mathtext]), closer)(`\n${source.slice(source.indexOf('\n') + 1)}`) || [[], ''];
  if (!rest.startsWith('\n$$')) return;
  const el = document.createElement('div');
  void el.setAttribute('class', 'math');
  void el.appendChild(squash([document.createTextNode('$$\n'), ...cs, document.createTextNode('\n$$')]));
  return consumeBlockEndEmptyLine<HTMLDivElement, SubParsers>([el], source.slice(source.length - rest.length + 3 + 1));
};
