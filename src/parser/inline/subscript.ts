import { Result } from '../../parser';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { SubScriptParser } from '../inline';
import { TextParser, squash } from '../text';
import { text } from '../text/text';

type SubParsers = [TextParser];

const syntax = /^~\S[^\n]*?~/;
const closer = /^~|^\n/;

export const subscript: SubScriptParser = function (source: string): Result<HTMLElement, SubParsers> {
  if (!source.startsWith('~') || source.search(syntax) !== 0) return;
  const [cs, rest] = loop(combine<SubParsers, HTMLElement | Text>([text]), closer)(source.slice(1)) || [[], ''];
  if (!rest.startsWith('~')) return;
  const el = document.createElement('sub');
  void el.appendChild(squash(cs));
  if (el.textContent!.trim() === '') return;
  if (el.textContent !== el.textContent!.trim()) return;
  return [[el], rest.slice(1)];
};
