import { undefined, location } from 'spica/global';
import { ObjectSetPrototypeOf } from 'spica/alias';
import { MediaParser } from '../inline';
import { union, inits, tails, some, validate, verify, guard, creator, surround, open, dup, lazy, fmap, bind } from '../../combinator';
import { link, uri, option as linkoption, resolve } from './link';
import { attributes } from './html';
import { htmlentity } from './htmlentity';
import { txt, str } from '../source';
import { isStartTight, isEndTight } from '../util';
import { html, define } from 'typed-dom';
import { ReadonlyURL } from 'spica/url';
import { unshift, push, join } from 'spica/array';

const optspec = {
  'aspect-ratio': [],
  rel: undefined,
} as const;
ObjectSetPrototypeOf(optspec, null);

export const media: MediaParser = lazy(() => creator(100, bind(verify(fmap(open(
  '!',
  validate(['[', '{'], '}', '\n',
  guard(context => context.syntax?.inline?.media ?? true,
  tails([
    dup(surround(/^\[(?!\\?\s)/, some(union([htmlentity, bracket, txt]), ']', /^\\?\n/), ']', true)),
    dup(surround(/^{(?![{}])/, inits([uri, some(option)]), /^ ?}/)),
  ])))),
  ([as, bs]) => bs ? [[join(as)], bs] : [[''], as]),
  ([[text]]) => isStartTight([text || '-']) && isEndTight([text])),
  ([[text], params], rest, context) => {
    const INSECURE_URI = params.shift()!;
    if (INSECURE_URI[0] === ' ') return;
    assert(INSECURE_URI === INSECURE_URI.trim());
    assert(!INSECURE_URI.match(/\s/));
    const src = resolve(INSECURE_URI, context.host || location, context.url || location);
    const url = new ReadonlyURL(src, context.host?.href || location.href);
    const cache = context.caches?.media;
    const cached = cache?.has(url.href);
    const el = cache && cached
      ? cache.get(url.href)!.cloneNode(true)
      : html('img', { class: 'media', 'data-src': src, alt: text.trimEnd() });
    if (!cached && !sanitize(url, el)) return [[el], rest];
    cached && el.hasAttribute('alt') && el.setAttribute('alt', text.trimEnd());
    define(el, attributes('media', push([], el.classList), optspec, params));
    assert(el.matches('img') || !el.matches('.invalid'));
    if (context.syntax?.inline?.link === false || cached && el.tagName !== 'IMG') return [[el], rest];
    return fmap(
      link as MediaParser,
      ([link]) => [define(link, { target: '_blank' }, [el])])
      (`{ ${INSECURE_URI}${join(params)} }${rest}`, context);
  })));

const bracket: MediaParser.TextParser.BracketParser = lazy(() => union([
  surround(str('('), some(union([htmlentity, bracket, txt]), ')'), str(')'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('['), some(union([htmlentity, bracket, txt]), ']'), str(']'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('{'), some(union([htmlentity, bracket, txt]), '}'), str('}'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('"'), some(union([htmlentity, txt]), '"'), str('"'), true),
]));

const option: MediaParser.ParameterParser.OptionParser = union([
  fmap(str(/^ [1-9][0-9]*:[1-9][0-9]*(?=[ }])/), ([opt]) => [` aspect-ratio="${opt.slice(1).split(':').join('/')}"`]),
  linkoption,
]);

function sanitize(uri: ReadonlyURL, target: HTMLElement): boolean {
  assert(target.tagName === 'IMG');
  switch (uri.protocol) {
    case 'http:':
    case 'https:':
      assert(uri.host);
      return true;
  }
  assert(!target.classList.contains('invalid'));
  define(target, {
    class: void target.classList.add('invalid'),
    'data-invalid-syntax': 'media',
    'data-invalid-type': 'argument',
    'data-invalid-description': 'Invalid protocol.',
  });
  return false;
}
