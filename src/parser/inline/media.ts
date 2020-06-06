import { undefined } from 'spica/global';
import { MediaParser } from '../inline';
import { union, inits, tails, some, validate, guard, creator, fmap, bind, surround, open, lazy } from '../../combinator';
import { dup } from '../util';
import { link, optspec, uri, option, sanitize } from './link';
import { text, char } from '../source';
import { attributes } from './html';
import { html, define } from 'typed-dom';
import { Cache } from 'spica/cache';
import { unshift, join } from 'spica/array';

const url = html('a');

export const cache = new Cache<string, HTMLElement>(10);

export const media: MediaParser = lazy(() => creator(10, bind(fmap(open(
  '!',
  validate(['[', '{'],
  validate(/^(?:\[[^\n]*?\])?\{[^\n]+?\}/,
  guard(context => context.syntax?.inline?.media ?? true,
  tails([
    dup(surround(/^\[(?!\s)/, some(union([bracket, text]), /^(?:\\?\n|\])/), ']', true)),
    dup(surround(/^{(?![{}])/, inits([uri, some(option)]), /^ ?}/)),
  ]))))),
  ([as, bs]: string[][]) => bs ? [[join(as)], bs] : [[''], as]),
  ([[text], options], rest, context) => {
    if (text.length > 0 && text.slice(-2).trim() === '') return;
    const INSECURE_URI = options.shift()!;
    assert(INSECURE_URI === INSECURE_URI.trim());
    assert(!INSECURE_URI.match(/\s/));
    url.href = INSECURE_URI;
    const key = url.href;
    const cached = cache.has(key);
    const el = cached
      ? cache.get(key)!.cloneNode(true)
      : html('img', { class: 'media', 'data-src': INSECURE_URI, alt: text.trim() });
    if (cached) {
      el.hasAttribute('alt') && el.setAttribute('alt', text.trim());
    }
    else {
      if (!sanitize(url, el, INSECURE_URI, context.origin)) return [[el], rest];
    }
    define(el, {
      ...attributes('media', optspec, options, cached ? [...el.classList] : ['media']),
      nofollow: undefined,
    });
    return (context.syntax?.inline?.link ?? true)
        && (!cached || el.tagName === 'IMG')
      ? fmap(link as MediaParser, ([link]) => [define(link, { target: '_blank' }, [el])])
          (`{ ${INSECURE_URI}${join(options)} }${rest}`, context)
      : [[el], rest];
  })));

const bracket: MediaParser.TextParser.BracketParser = lazy(() => creator(union([
  surround(char('('), some(union([bracket, text]), /^(?:\\?\n|\))/), char(')'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(char('['), some(union([bracket, text]), /^(?:\\?\n|\])/), char(']'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(char('{'), some(union([bracket, text]), /^(?:\\?\n|\})/), char('}'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(char('"'), some(text, /^(?:\\?\n|")/), char('"'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
])));
