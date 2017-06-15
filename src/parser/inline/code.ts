import { Result } from '../../parser';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { CodeParser } from '../inline';
import { PlainTextParser, squash } from '../text';
import { plaintext } from '../text/plaintext';

type SubParsers = [PlainTextParser];

const syntax = /^(`+)[^\n]+?\1/;

export const code: CodeParser = function (source: string): Result<HTMLElement, SubParsers> {
  if (!source.startsWith('`')) return;
  const [whole, keyword] = source.match(syntax) || ['', ''];
  if (!whole) return;
  const [cs, rest] = loop(combine<SubParsers, Text>([plaintext]), `^${keyword}`)(source.slice(keyword.length)) || [[], ''];
  if (!rest.startsWith(keyword)) return;
  const el = document.createElement('code');
  void el.appendChild(squash(cs));
  if (el.textContent!.trim() === '') return;
  el.textContent = el.textContent!.trim();
  return [[el], rest.slice(keyword.length)];
};
