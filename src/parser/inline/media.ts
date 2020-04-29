import { MediaParser } from '../inline';
import { union, inits, tails, some, validate, guard, creator, fmap, bind, surround, open, lazy } from '../../combinator';
import { dup } from '../util';
import { link, attributes, uri, attribute, sanitize } from './link';
import { text, char } from '../source';
import { makeAttrs } from './html';
import { html, define } from 'typed-dom';
import { Cache } from 'spica/cache';
import { unshift, join } from 'spica/array';

const url = html('a');

export const cache = new Cache<string, HTMLElement>(10);

export const media: MediaParser = lazy(() => creator(10, validate(['![', '!{'], bind(fmap(open(
  '!',
  guard(context => context.syntax?.inline?.media ?? true,
  validate(/^(?:\[[^\n]*?\])?\{[^\n]+?\}/,
  tails([
    dup(surround(/^\[(?!\s)/, some(union([bracket, text]), /^(?:\\?\n|\])/), ']', true)),
    dup(surround(/^{(?![{}])/, inits([uri, some(attribute)]), /^ ?}/)),
  ])))),
  ([as, bs]: string[][]) => bs ? [[join(as)], bs] : [[''], as]),
  ([[text], params], rest, context) => {
    const INSECURE_URI = params.shift()!;
    assert(INSECURE_URI === INSECURE_URI.trim());
    assert(!INSECURE_URI.match(/\s/));
    if (text.length > 0 && text.slice(-2).trim() === '') return;
    url.href = INSECURE_URI;
    const key = url.href;
    const media = cache.has(key)
      ? cache.get(key)!.cloneNode(true)
      : html('img', { class: 'media', 'data-src': INSECURE_URI, alt: text.trim() });
    if (cache.has(key)) {
      media.hasAttribute('alt') && void media.setAttribute('alt', text.trim());
    }
    else {
      if (!sanitize(url, media, INSECURE_URI)) return [[media], rest];
    }
    void define(media, {
      ...makeAttrs(attributes, params, [...media.classList], 'media'),
      nofollow: void 0,
    });
    return (context.syntax?.inline?.link ?? true)
        && media.tagName === 'IMG'
      ? fmap(link as MediaParser, ([el]) => [define(el, { target: '_blank' }, [media])])
          (`{ ${INSECURE_URI}${join(params)} }${rest}`, context)
      : [[media], rest];
  }))));

const bracket: MediaParser.TextParser.BracketParser = lazy(() => creator(union([
  surround(char('('), some(union([bracket, text]), /^(?:\\?\n|\))/), char(')'), true, void 0, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(char('['), some(union([bracket, text]), /^(?:\\?\n|\])/), char(']'), true, void 0, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(char('{'), some(union([bracket, text]), /^(?:\\?\n|\})/), char('}'), true, void 0, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(char('"'), some(text, /^(?:\\?\n|")/), char('"'), true, void 0, ([as, bs = []], rest) => [unshift(as, bs), rest]),
])));
