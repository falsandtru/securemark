import { Result } from '../../parser';
import { ImageParser, TextParser } from '../inline';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { text } from './text';
import { sanitize } from '../string/url';

type SubParsers = [TextParser];

const syntax = /^!\[[^\n]*?\]\(/;

export const image: ImageParser = function (source: string): Result<HTMLImageElement, never> {
  if (!source.startsWith('![') || !source.match(syntax)) return;
  const [[, , ...first], next] = loop(combine<SubParsers, HTMLElement | Text>([text]), /^\]|^\n/)(source) || [[], ''];
  if (!next.startsWith('](')) return;
  const caption = first.reduce((s, c) => s + c.textContent, '').trim();
  const [[, , ...second], rest] = loop(text, /^\)|^\s/)(next) || [[], ''];
  if (!rest.startsWith(')')) return;
  const url = sanitize(second.reduce((s, c) => s + c.textContent, ''));
  if (url === '') return;
  const el = document.createElement('img');
  void el.setAttribute('data-src', url);
  void el.setAttribute('alt', caption);
  return [[el], rest.slice(1)];
}
