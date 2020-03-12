import { encodeURI } from 'spica/global';
import { ObjectAssign } from 'spica/alias';
import { MediaParser } from '../inline';
import { union, inits, tails, some, validate, guard, creator, fmap, bind, surround, open, lazy } from '../../combinator';
import { dup } from '../util';
import { link, attributes, uri, attribute } from './link';
import { text, str, char } from '../source';
import { makeAttrs } from './html';
import { html, define } from 'typed-dom';
import { Cache } from 'spica/cache';
import { unshift, join } from 'spica/array';

const url = html('a');

export const cache = new Cache<string, HTMLElement>(10);

export const media: MediaParser = lazy(() => creator(validate(['![', '!{'], bind(fmap(open(
  '!',
  guard(context => (context.syntax?.inline?.link ?? true) && (context.syntax?.inline?.media ?? true),
  validate(/^(?:\[[^\n]*?\])?\{[^\n]+?\}/,
  tails([
    dup(surround(/^\[(?!\s)/, some(union([bracket, some(text, /^(?:\\?\n|[\]([{<"])/)]), ']'), ']', true)),
    dup(surround(/^{(?![{}])/, inits([uri, some(attribute)]), /^ ?}/)),
  ])))),
  ([as, bs]: string[][]) => bs ? [[join(as)], bs] : [[''], as]),
  ([[text], params], rest, context) => {
    const INSECURE_URI = params.shift()!;
    assert(INSECURE_URI === INSECURE_URI.trim());
    if (text.length > 0 && text.slice(-2).trim() === '') return;
    url.href = INSECURE_URI;
    const key = url.href;
    const media = cache.has(key)
      ? cache.get(key)!.cloneNode(true)
      : html('img', { class: 'media', 'data-src': INSECURE_URI.replace(/\s+/g, encodeURI), alt: text.trim() });
    if (cache.has(key) && media.hasAttribute('alt')) {
      assert(['IMG', 'AUDIO', 'VIDEO'].includes(media.tagName));
      void define(media, { alt: text.trim() });
    }
    void define(media, ObjectAssign(
      makeAttrs(attributes, params, [...media.classList], 'media'),
      { nofollow: void 0 }));
    return fmap(
      link as MediaParser,
      ([el]: [HTMLAnchorElement]) =>
        [define(el, { target: '_blank' }, [define(media, { 'data-src': el.getAttribute('href') })])])
      (`{ ${INSECURE_URI}${join(params)} }${rest}`, context);
  }))));

const bracket: MediaParser.TextParser.BracketParser = lazy(() => creator(union([
  surround(char('('), some(union([bracket, str(/^(?:\\[^\n]?|[^\n\)([{<"\\])+/)])), char(')'), true, void 0, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(char('['), some(union([bracket, str(/^(?:\\[^\n]?|[^\n\]([{<"\\])+/)])), char(']'), true, void 0, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(char('{'), some(union([bracket, str(/^(?:\\[^\n]?|[^\n\}([{<"\\])+/)])), char('}'), true, void 0, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(char('<'), some(union([bracket, str(/^(?:\\[^\n]?|[^\n\>([{<"\\])+/)])), char('>'), true, void 0, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(char('"'), str(/^(?:\\[^\n]?|[^\n"])+/), char('"'), true, void 0, ([as, bs = []], rest) => [unshift(as, bs), rest]),
])));
