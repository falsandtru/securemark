import { Result } from '../../combinator/parser';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { MediaParser } from '../inline';
import { TextParser } from '../text';
import { text } from '../text/text';
import { sanitize } from '../text/url';
import DOM from 'typed-dom';
import { Cache } from 'spica/cache';

export const cache = new Cache<string, HTMLImageElement>(100);

type SubParsers = [TextParser];

const syntax = /^!\[[^\n]*?\]\n?\(/;

export const media: MediaParser = function (source: string): Result<HTMLImageElement, SubParsers> {
  if (!source.startsWith('![') || source.search(syntax) !== 0) return;
  const [[, , ...first], next] = loop(combine<SubParsers, HTMLElement | Text>([text]), /^\]\n?\(|^\n/)(source) || [[], ''];
  if (!next.startsWith('](') && !next.startsWith(']\n(')) return;
  const caption = first.reduce((s, c) => s + c.textContent, '').trim();
  const [[...second], rest] = loop(text, /^\)|^\s/)(next.replace(/^\]\n?\(/, '')) || [[], ''];
  if (!rest.startsWith(')')) return;
  const url = sanitize(second.reduce((s, c) => s + c.textContent, ''));
  if (url === '') return;
  if (cache.has(url)) return [[<HTMLImageElement>cache.get(url)!.cloneNode(true)], rest.slice(1)];
  const el = DOM.img({
    'data-src': url,
    alt: caption,
  }).element;
  return [[el], rest.slice(1)];
};
