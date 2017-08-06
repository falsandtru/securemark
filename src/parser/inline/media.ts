import { Result } from '../../combinator/parser';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { MediaParser } from '../inline';
import { TextParser } from '../text';
import { text } from '../text/text';
import { sanitize } from '../text/url';
import DOM from 'typed-dom';

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
  const type = mediatype(url);
  if (url === '') return;
  const el = DOM.img({
    class: 'media',
    'data-type': type,
    [type === 'image' ? 'src' : 'data-src']: url,
    alt: caption,
    style: 'max-width: 100%;',
  }).element;
  if (el.getAttribute('data-format') === 'image') {
    void el.setAttribute('src', url);
  }
  return [[el], rest.slice(1)];
};

export function mediatype(url: string): string {
  switch (true) {
    case url.startsWith('https://twitter.com/'):
      return 'twitter';
    case url.startsWith('https://youtu.be/'):
    case url.startsWith('https://www.youtube.com/watch?v='):
      return 'youtube';
    case url.startsWith('https://www.slideshare.net/'):
      return 'slideshare';
    case url.startsWith('https://gist.github.com/'):
      return 'gist';
    case url.split(/[?#]/, 1).shift()!.endsWith('.pdf') && url.split('/').length > 3:
      return 'pdf'
    default:
      return 'image';
  }
}
