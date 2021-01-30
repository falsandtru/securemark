import { undefined, location } from 'spica/global';
import { ObjectSetPrototypeOf } from 'spica/alias';
import { MediaParser } from '../inline';
import { union, inits, tails, some, validate, guard, creator, surround, open, lazy, fmap, bind } from '../../combinator';
import { isEndTight, dup } from '../util';
import { link, optspec as linkoptspec, uri, option, resolve, sanitize } from './link';
import { attributes } from './html';
import { text, str } from '../source';
import { ReadonlyURL } from 'spica/url';
import { unshift, push, join } from 'spica/array';
import { html, define } from 'typed-dom';

const optspec = {
  'aspect-ratio': [],
  ...linkoptspec,
} as const;
ObjectSetPrototypeOf(optspec, null);
const remap = {
  nofollow: () => undefined,
} as const;

export const media: MediaParser = lazy(() => creator(10, bind(fmap(open(
  '!',
  validate(['[', '{'], '}', '\n',
  guard(context => context.syntax?.inline?.media ?? true,
  tails([
    dup(surround(/^\[(?!\\?\s)/, some(union([bracket, text]), ']', /^\\?\n/), ']', true)),
    dup(surround(/^{(?![{}])/, inits([uri, some(option)]), /^ ?}/)),
  ])))),
  ([as, bs]) => bs ? [bs, [join(as)]] : [as, ['']]),
  ([params, [text]], rest, context) => {
    if (!isEndTight([text])) return;
    const INSECURE_URI = params.shift()!;
    assert(INSECURE_URI === INSECURE_URI.trim());
    assert(!INSECURE_URI.match(/\s/));
    const src = resolve(INSECURE_URI, context.host || location, context.url || location);
    const url = new ReadonlyURL(src, context.host?.href || location.href);
    const cache = context.caches?.media;
    const cached = cache?.has(url.href);
    const el = cache && cached
      ? cache.get(url.href)!.cloneNode(true)
      : html('img', { class: 'media', 'data-src': src, alt: text.trim() });
    if (!cached && !sanitize(url, el, INSECURE_URI, context.host?.origin || location.origin)) return [[el], rest];
    cached && el.hasAttribute('alt') && el.setAttribute('alt', text.trim());
    define(el, attributes('media', push([], el.classList), optspec, params, remap));
    return (context.syntax?.inline?.link ?? true)
        && (!cached || el.tagName === 'IMG')
      ? fmap(link as MediaParser, ([link]) => [define(link, { target: '_blank' }, [el])])
          (`{ ${INSECURE_URI}${join(params)} }${rest}`, context)
      : [[el], rest];
  })));

const bracket: MediaParser.TextParser.BracketParser = lazy(() => creator(union([
  surround(str('('), some(union([bracket, text]), ')'), str(')'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('['), some(union([bracket, text]), ']'), str(']'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('{'), some(union([bracket, text]), '}'), str('}'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('"'), some(text, '"'), str('"'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
])));
