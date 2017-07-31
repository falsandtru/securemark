import { Result } from '../../combinator/parser';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { MediaParser } from '../inline';
import { TextParser } from '../text';
import { text } from '../text/text';
import { sanitize } from '../text/url';

type SubParsers = [TextParser];

const syntax = /^!\[[^\n]*?\]\(/;

export const media: MediaParser = function (source: string): Result<HTMLImageElement, never> {
  if (!source.startsWith('![') || source.search(syntax) !== 0) return;
  const [[, , ...first], next] = loop(combine<SubParsers, HTMLElement | Text>([text]), /^\]\(|^\n/)(source) || [[], ''];
  if (!next.startsWith('](')) return;
  const caption = first.reduce((s, c) => s + c.textContent, '').trim();
  const [[, , ...second], rest] = loop(text, /^\)|^\s/)(next) || [[], ''];
  if (!rest.startsWith(')')) return;
  const url = sanitize(second.reduce((s, c) => s + c.textContent, ''));
  if (url === '') return;
  const el = document.createElement('img');
  void el.setAttribute('class', 'media');
  void el.setAttribute('data-src', url);
  void el.setAttribute('alt', caption);
  return [[el], rest.slice(1)];
};
