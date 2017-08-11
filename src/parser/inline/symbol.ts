import { Result } from '../../combinator/parser';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { SymbolParser, inline } from '../inline';
import { TextParser, squash } from '../text';
import { text } from '../text/text';

type SubParsers = [TextParser];

const syntax = /^\[[~!@#$%^&*():<>{}?]\S[^\n]*?\]/;

export const symbol: SymbolParser = function (source: string): Result<HTMLSpanElement, SubParsers> {
  if (!source.startsWith('[') || source.search(syntax) !== 0) return;
  const [cs, rest] = loop(combine<SubParsers, HTMLElement | Text>([text]), /^[\]\n]/)(`${source.slice(2)}`) || [[], ''];
  if (!rest.startsWith(']')) return;
  const txt = squash(cs).textContent!;
  if (txt !== txt.trim()) return;
  const el = document.createElement('span');
  void el.appendChild(squash(loop(inline)(`++**WARNING: DON'T USE \`[${source[1]} ]\` SYNTAX!!** This syntax is reserved for extensibility.++`)![0]));
  return [[el], rest.slice(1)];
};
