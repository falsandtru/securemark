import { undefined, location } from 'spica/global';
import { MediaParser } from '../inline';
import { union, inits, tails, some, validate, guard, creator, surround, open, lazy, fmap, bind } from '../../combinator';
import { dup } from '../util';
import { link, optspec, uri, option, resolve, sanitize } from './link';
import { text, str } from '../source';
import { attributes } from './html';
import { URL } from 'spica/url';
import { unshift, join } from 'spica/array';
import { html, define } from 'typed-dom';

export const media: MediaParser = lazy(() => creator(10, bind(fmap(open(
  '!',
  validate(['[', '{'], '}', '\n',
  validate(/^(?:\[[^\n]*?\])?\{[^\n]+?\}/,
  guard(context => context.syntax?.inline?.media ?? true,
  tails([
    dup(surround(/^\[(?!\\?\s)/, some(union([bracket, text]), ']', /^\\?\n/), ']', true)),
    dup(surround(/^{(?![{}])/, inits([uri, some(option)]), /^ ?}/)),
  ]))))),
  ([as, bs]: string[][]) => bs ? [[join(as)], bs] : [[''], as]),
  ([[text], options], rest, context) => {
    if (text.length > 0 && text.slice(-2).trimStart() === '') return;
    const INSECURE_URI = options.shift()!;
    assert(INSECURE_URI === INSECURE_URI.trim());
    assert(!INSECURE_URI.match(/\s/));
    const src = resolve(INSECURE_URI, context.host || location, context.url || location);
    const url = new URL(src, context.host?.href || location.href);
    const cache = context.caches?.media;
    const cached = cache?.has(url.href);
    const el = cache && cached
      ? cache.get(url.href)!.cloneNode(true)
      : html('img', { class: 'media', 'data-src': src, alt: text.trim() });
    if (!cached && !sanitize(url, el, INSECURE_URI, context.host?.origin || location.origin)) return [[el], rest];
    cached && el.hasAttribute('alt') && el.setAttribute('alt', text.trim());
    define(el, {
      ...attributes('media', optspec, options, el.className.trim().split(/\s+/)),
      nofollow: undefined,
    });
    return (context.syntax?.inline?.link ?? true)
        && (!cached || el.tagName === 'IMG')
      ? fmap(link as MediaParser, ([link]) => [define(link, { target: '_blank' }, [el])])
          (`{ ${INSECURE_URI}${join(options)} }${rest}`, context)
      : [[el], rest];
  })));

const bracket: MediaParser.TextParser.BracketParser = lazy(() => creator(union([
  surround(str('('), some(union([bracket, text]), ')'), str(')'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('['), some(union([bracket, text]), ']'), str(']'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('{'), some(union([bracket, text]), '}'), str('}'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('"'), some(text, '"'), str('"'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
])));
