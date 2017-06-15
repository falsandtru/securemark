import { Result } from '../../parser';
import { MathBlockParser, consumeBlockEndEmptyLine } from '../block';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { MathTextParser, squash } from '../text';
import { mathtext } from '../text/mathtext';

type SubParsers = [MathTextParser];

const syntax = /^\$\$\s*?\n(?:[^\n]*\n)*?\$\$/;
const closer = /^\n\$\$\s*?(?:\n|$)/;

export const mathblock: MathBlockParser = function (source: string): Result<HTMLDivElement, SubParsers> {
  if (!source.startsWith('$$') || source.search(syntax) !== 0) return;
  const [[, ...cs], rest] = loop(combine<SubParsers, Text>([mathtext]), closer)(`\n${source.slice(source.indexOf('\n') + 1)}`) || [[], ''];
  if (rest.search(closer) !== 0) return;
  const el = document.createElement('div');
  void el.setAttribute('class', 'math');
  void el.appendChild(squash([document.createTextNode('$$\n'), ...cs, document.createTextNode('\n$$')]));
  return consumeBlockEndEmptyLine<HTMLDivElement, SubParsers>([el], source.slice(source.length - rest.length + 3 + 1));
};
