import { Result } from '../../parser';
import { SuperScriptParser, TextParser } from '../inline';
import { compose } from '../../combinator/compose';
import { loop } from '../../combinator/loop';
import { text, squash } from './text';

type SubParsers = [TextParser];

const syntax = /^\^\S[^\n]*?\^/;
const closer = /^\^|^\n/;

export const superscript: SuperScriptParser = function (source: string): Result<HTMLElement, SubParsers> {
  if (!source.startsWith('^') || source.startsWith('^^') || !source.match(syntax)) return;
  const [cs, rest] = loop(compose<SubParsers, HTMLElement | Text>([text]), closer)(source.slice(1)) || [[], ''];
  if (!rest.startsWith('^')) return;
  const el = document.createElement('sup');
  void el.appendChild(squash(cs));
  if (el.textContent && el.textContent!== el.textContent!.trim()) return;
  return [[el], rest.slice(1)];
}
