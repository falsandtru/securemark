import { Result } from '../../parser';
import { CodeParser, PlainTextParser } from '../inline';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { plaintext } from './plaintext';
import { squash } from './text';

type SubParsers = [PlainTextParser];

const syntax = /^([\`]+)[^\n]+?\1/;
const cache = new Map<string, RegExp>();

export const code: CodeParser = function (source: string): Result<HTMLElement, SubParsers> {
  if (!source.startsWith('`')) return;
  const [whole, keyword] = source.match(syntax) || ['', ''];
  if (!whole) return;
  if (!cache.has(keyword)) {
    void cache.set(keyword, new RegExp(`^${keyword}`));
  }
  const [cs, rest] = loop(combine<SubParsers, Text>([plaintext]), cache.get(keyword)!)(source.slice(keyword.length)) || [[], ''];
  if (!rest.startsWith(keyword)) return;
  const el = document.createElement('code');
  void el.appendChild(squash(cs));
  el.textContent = el.textContent!.trim();
  return [[el], rest.slice(keyword.length)];
}
