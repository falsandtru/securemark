import { Result } from '../../parser';
import { SubScriptParser, TextParser, squash } from '../inline';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { text } from './text';

type SubParsers = [TextParser];

const syntax = /^~\S[^\n]*?~/;
const closer = /^~|^\n/;

export const subscript: SubScriptParser = function (source: string): Result<HTMLElement, SubParsers> {
  if (!source.startsWith('~') || !source.match(syntax)) return;
  const [cs, rest] = loop(combine<SubParsers, HTMLElement | Text>([text]), closer)(source.slice(1)) || [[], ''];
  if (!rest.startsWith('~')) return;
  const el = document.createElement('sub');
  void el.appendChild(squash(cs));
  if (el.textContent !== el.textContent!.trim()) return;
  return [[el], rest.slice(1)];
};
