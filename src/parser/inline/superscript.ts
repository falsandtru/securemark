import { Result } from '../../combinator/parser';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { SuperScriptParser } from '../inline';
import { TextParser } from '../source';
import { text } from '../source/text';
import { squash } from '../squash';

type SubParsers = [TextParser];

const syntax = /^\^\S[^\n]*?\^/;
const closer = /^\^|^\n/;

export const superscript: SuperScriptParser = function (source: string): Result<HTMLElement, SubParsers> {
  if (!source.startsWith('^') || source.search(syntax) !== 0) return;
  const [cs, rest] = loop(combine<SubParsers, HTMLElement | Text>([text]), closer)(source.slice(1)) || [[], ''];
  if (!rest.startsWith('^')) return;
  const el = document.createElement('sup');
  void el.appendChild(squash(cs));
  if (el.textContent!.trim() === '') return;
  if (el.textContent !== el.textContent!.trim()) return;
  return [[el], rest.slice(1)];
};
