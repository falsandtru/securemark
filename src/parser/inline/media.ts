import { encodeURI } from 'spica/global';
import { ObjectAssign } from 'spica/alias';
import { MediaParser } from '../inline';
import { union, inits, tails, some, creator, backtracker, surround, open, clear, guard, fmap, bind } from '../../combinator';
import { dup } from '../util';
import { link, attributes, uri, attribute } from './link';
import { str, char } from '../source';
import { makeAttrs } from './html';
import { html, define } from 'typed-dom';
import { Cache } from 'spica/cache';
import { push } from 'spica/array';

const url = html('a');

export const cache = new Cache<string, HTMLElement>(10);

export const media: MediaParser = creator(bind(fmap(open(
  '!',
  guard(context => context.syntax?.inline?.media ?? true,
  tails([
    dup(surround('[', union([str(/^(?!\\?\s)(?:\\[^\n]|[^\]\n])+/)]), backtracker(clear(char(']'))), true)),
    // TODO: Count this backtracking.
    dup(surround(/^{(?![{}])/, inits([uri, some(attribute)]), backtracker(clear(str(/^ ?}/))))),
  ]))),
  (ts: Text[][]) =>
    push([ts.length > 1 && ts[ts.length - 2][0]?.data || ''], ts[ts.length - 1].map(t => t.data))),
  ([text, INSECURE_URL, ...params]: string[], rest) => {
    assert(INSECURE_URL === INSECURE_URL.trim());
    text = text.trim().replace(/\\(.?)/g, '$1');
    url.href = INSECURE_URL;
    const media = void 0
      || cache.get(url.href)?.cloneNode(true)
      || html('img', { class: 'media', 'data-src': INSECURE_URL.replace(/\s+/g, encodeURI), alt: text });
    if (cache.has(url.href) && media.hasAttribute('alt')) {
      assert(['IMG', 'AUDIO', 'VIDEO'].includes(media.tagName));
      void define(media, { alt: text });
    }
    void define(media, ObjectAssign(
      makeAttrs(attributes, params, [...media.classList], 'media'),
      { nofollow: void 0 }));
    return fmap(
      link as MediaParser,
      ([el]: [HTMLAnchorElement]) =>
        [define(el, { target: '_blank' }, [define(media, { 'data-src': el.getAttribute('href') })])])
      (`{ ${INSECURE_URL}${params.join('')} }${rest}`, {});
  }));
