import { MediaParser } from '../inline';
import { union, inits, sequence, some, fmap, bind, surround, validate, verify, subline } from '../../combinator';
import { text } from '../source/text';
import '../source/unescapable';
import { uri, attribute, check } from './link';
import { sanitize } from '../string/uri';
import { defrag, startsWithTightText } from '../util';
import { Cache } from 'spica/cache';
import { html, frag, define } from 'typed-dom';

const attributes: Record<string, Array<string | undefined>> = {
};

export const cache = new Cache<string, HTMLElement>(10);

export const media: MediaParser = subline(bind(validate(
  /^!\[.*?\]{( ?).*?\1}/,
  sequence<MediaParser>([
    fmap(verify(
      surround('![', defrag(some(union([text]), /^[\n\]]/)), ']', false),
      ns => ns.length === 0 || startsWithTightText(frag(ns))),
      ns => [frag(ns.reduce((s, n) => s + n.textContent, '').trim())]),
    surround('{', inits([uri, some(defrag(attribute))]), /^ ?}/),
  ])),
  (ts, rest) => {
    const [caption, INSECURE_URL = '', ...params]: string[] = ts.map(t => t.textContent!);
    const path = sanitize(INSECURE_URL.trim());
    if (path === '' && INSECURE_URL !== '') return;
    const uri = new URL(path, window.location.href);
    if (uri.protocol === 'tel:') return;
    const attrs: Map<string, string | undefined> = new Map(params.map<[string, string | undefined]>(
      param => [param.split('=', 1)[0], param.includes('=') ? param.slice(param.split('=', 1)[0].length + 1) : undefined]));
    const el = cache.has(uri.href)
      ? cache.get(uri.href)!.cloneNode(true)
      : html('img', { class: 'media', 'data-src': path, alt: caption });
    if (cache.has(uri.href) && ['img', 'audio', 'video'].includes(el.tagName.toLowerCase())) {
      void define(el, { alt: caption });
    }
    if (!check(attrs, params, attributes)) {
      void el.classList.add('invalid');
      void el.setAttribute('data-invalid-type', 'parameter');
    }
    return [[el], rest];
  }));
