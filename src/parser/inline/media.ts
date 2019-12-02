import { MediaParser } from '../inline';
import { union, inits, tails, some, subline, verify, surround, guard, fmap, bind } from '../../combinator';
import { text } from '../source';
import { link, attributes, uri, attrs } from './link';
import { attribute } from './html';
import { sanitize } from '../string/uri';
import { defrag, dup, trimNodeEnd, hasTightText } from '../util';
import { Cache } from 'spica/cache';
import { concat } from 'spica/concat';
import { html, define } from 'typed-dom';

export const cache = new Cache<string, HTMLElement>(10);

export const media: MediaParser = subline(bind(fmap(verify(fmap(surround(
  /^!(?=(?:\[.*?\])?{.+?})/,
  guard(config => config?.syntax?.inline?.media ?? true,
  tails([
    dup(surround('[', trimNodeEnd(defrag(some(union([text]), /^\\?\n|^]/))), ']', false)),
    dup(surround('{', inits([uri, some(defrag(attribute))]), /^ ?}/)),
  ])),
  ''),
  ns => concat([...Array(2 - ns.length)].map(() => []), ns)),
  ([text]) => text.length === 0 || hasTightText(text[0])),
  ([text, param]: (HTMLElement | Text)[][]) => [text[0]?.textContent || '', ...param.map(t => t.textContent!)]),
  ([text, INSECURE_URL, ...params]: string[], rest) => {
    const path = sanitize(INSECURE_URL.trim());
    if (path === undefined) return;
    const uri = new URL(path, window.location.href);
    const media = cache.has(uri.href)
      ? cache.get(uri.href)!.cloneNode(true)
      : html('img', { class: 'media', 'data-src': path, alt: text });
    if (cache.has(uri.href) && media.hasAttribute('alt')) {
      assert(['IMG', 'AUDIO', 'VIDEO'].includes(media.tagName));
      void define(media, { alt: text });
    }
    void define(media, attrs(attributes, params, media.className.trim().split(/\s+/), 'media'));
    return fmap(link as MediaParser, ([link]) => [define(link, { target: '_blank' }, [media])])
      (`{ ${INSECURE_URL}${params.map(p => ' ' + p).join('')} }${rest}`, {}, {});
  }));
