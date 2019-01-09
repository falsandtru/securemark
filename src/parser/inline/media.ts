import { MediaParser } from '../inline';
import { union, inits, tails, some, subline, verify, surround, fmap, bind } from '../../combinator';
import { text } from '../source/text';
import '../source/unescapable';
import { link, attributes, uri, attribute, check } from './link';
import { sanitize } from '../string/uri';
import { defrag, dup, trimNodeEnd, hasTightText } from '../util';
import { Cache } from 'spica/cache';
import { concat } from 'spica/concat';
import { html, text as txt, define } from 'typed-dom';

export const cache = new Cache<string, HTMLElement>(10);

export const media: MediaParser = subline(bind(fmap(verify(fmap(surround(
  /^!(?=(?:\[.*?\])?{.+?})/,
  tails<MediaParser>([
    dup(surround('[', trimNodeEnd(defrag(some(union([text]), /^[\n\]]/))), ']', false)),
    dup(surround('{', inits([uri, some(defrag(attribute))]), /^ ?}/)),
  ]),
  ''),
  ns => concat([...Array(2 - ns.length)].map(() => [txt('')]), ns)),
  ([[text = txt('')]]) => text.textContent! === '' || hasTightText(text)),
  ([[text = txt('')], param]) => [text.textContent!, ...param.map(t => t.textContent!)]),
  ([text, INSECURE_URL, ...params], rest) => {
    const path = sanitize(INSECURE_URL.trim());
    if (path === '' && INSECURE_URL !== '') return;
    const uri = new URL(path, window.location.href);
    if (uri.protocol === 'tel:') return;
    const attrs: Map<string, string | undefined> = new Map(params.map<[string, string | undefined]>(
      param => [param.split('=', 1)[0], param.includes('=') ? param.slice(param.split('=', 1)[0].length + 1) : undefined]));
    const el = cache.has(uri.href)
      ? cache.get(uri.href)!.cloneNode(true)
      : html('img', { class: 'media', 'data-src': path, alt: text });
    if (cache.has(uri.href) && ['img', 'audio', 'video'].includes(el.tagName.toLowerCase())) {
      void define(el, { alt: text });
    }
    if (!check(attrs, params, attributes)) {
      void el.classList.add('invalid');
      void define(el, {
        'data-invalid-syntax': 'media',
        'data-invalid-type': 'parameter',
      });
    }
    return el.matches('img')
      ? fmap(
          link,
          ([link]) =>
            [define(link, [el])])
          (`{ ${INSECURE_URL}${params.map(p => ' ' + p).join('')} }${rest}`) as [[HTMLAnchorElement], string]
      : [[el], rest];
  }));
