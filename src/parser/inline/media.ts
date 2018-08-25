import { MediaParser } from '../inline';
import { union, inits, sequence, some, fmap, bind, surround, verify, subline } from '../../combinator';
import { text } from '../source/text';
import '../source/unescapable';
import { uri, attribute, check } from './link';
import { sanitize } from '../string/uri';
import { compress, startsWithTightText } from '../util';
import { Cache } from 'spica/cache';
import { html, frag, define } from 'typed-dom';

const attributes: Record<string, Array<string | undefined>> = {
};

export const cache = new Cache<string, HTMLElement>(10);

export const media: MediaParser = subline(bind(
  sequence<MediaParser>([
    subline(fmap(
      verify(
        surround('![', compress(some(union([text]), ']')), /^\](?=\(( ?)[^\n]*?\1\))/, false),
        ns => ns.length === 0 || startsWithTightText(frag(ns))),
      ns => [frag(ns.reduce((s, n) => s + n.textContent, '').trim())])),
    subline(
      surround('(', inits<MediaParser.ParamParser>([uri, some(compress(attribute)),]), /^ ?\)/, false))
  ]),
  (ts, rest) => {
    const [caption, INSECURE_URL = '', ...args]: string[] = ts.map(t => t.textContent!);
    const path = sanitize(INSECURE_URL.trim());
    if (path === '' && INSECURE_URL !== '') return;
    if (path.trim().toLowerCase().startsWith('tel:')) return;
    const attrs: Map<string, string | undefined> = new Map(args.map<[string, string | undefined]>(
      arg => [arg.split('=', 1)[0], arg.includes('=') ? arg.slice(arg.split('=', 1)[0].length + 1) : undefined]));
    const uri = new URL(path, window.location.href).href;
    const el = cache.has(uri)
      ? cache.get(uri)!.cloneNode(true)
      : html('img', { class: 'media', 'data-src': path, alt: caption });
    if (cache.has(uri) && ['img', 'audio', 'video'].includes(el.tagName.toLowerCase())) {
      void define(el, { alt: caption });
    }
    if (!check(attrs, args, attributes)) {
      void el.classList.add('invalid');
      void el.setAttribute('data-invalid-type', 'parameter');
    }
    return [[el], rest];
  }));
