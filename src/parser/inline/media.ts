import { encodeURI } from 'spica/global';
import { ObjectAssign } from 'spica/alias';
import { MediaParser } from '../inline';
import { union, inits, tails, some, rewrite, creator, backtracker, surround, open, clear, guard, lazy, fmap, bind } from '../../combinator';
import { dup, stringify } from '../util';
import { link, attributes, uri, attribute } from './link';
import { escsource, str, char } from '../source';
import { makeAttrs } from './html';
import { html, define, text } from 'typed-dom';
import { Cache } from 'spica/cache';
import { unshift } from 'spica/array';

const url = html('a');

export const cache = new Cache<string, HTMLElement>(10);

export const media: MediaParser = lazy(() => creator(bind(fmap(open(
  '!',
  guard(context => (context.syntax?.inline?.link ?? true) && (context.syntax?.inline?.media ?? true),
  tails([
    dup(surround(/^\[(?!\s)/, some(union([bracket, some(escsource, /^(?:\\?\n|[\]([{<"])/)]), ']'), backtracker(clear(char(']'))), true)),
    // TODO: Count this backtracking.
    dup(surround(/^{(?![{}])/, inits([uri, some(attribute)]), backtracker(clear(str(/^ ?}/))))),
  ]))),
  (ts: Text[][]) =>
    unshift([ts.length > 1 ? stringify(ts[0]) : ''], ts[ts.length - 1].map(t => t.data))),
  ([text, INSECURE_URL, ...params]: string[], rest, context) => {
    assert(INSECURE_URL === INSECURE_URL.trim());
    if (text.length > 0 && text.slice(-2).trim() === '') return;
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
      (`{ ${INSECURE_URL}${params.join('')} }${rest}`, context);
  })));

const bracket: MediaParser.TextParser.BracketParser = lazy(() => rewrite(
  union([
    surround('(', some(union([bracket, str(/^(?:\\[^\n]?|[^\n\)([{<"\\])+/)])), backtracker(char(')')), true, void 0, ([as, bs = []], rest) => [unshift(as, bs), rest]),
    surround('[', some(union([bracket, str(/^(?:\\[^\n]?|[^\n\]([{<"\\])+/)])), backtracker(char(']')), true, void 0, ([as, bs = []], rest) => [unshift(as, bs), rest]),
    surround('{', some(union([bracket, str(/^(?:\\[^\n]?|[^\n\}([{<"\\])+/)])), backtracker(char('}')), true, void 0, ([as, bs = []], rest) => [unshift(as, bs), rest]),
    surround('<', some(union([bracket, str(/^(?:\\[^\n]?|[^\n\>([{<"\\])+/)])), backtracker(char('>')), true, void 0, ([as, bs = []], rest) => [unshift(as, bs), rest]),
    surround('"', str(/^(?:\\[^\n]?|[^\n([{<"\\])+/), backtracker(char('"')), true, void 0, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  ]),
  source => [[text(source)], '']));
