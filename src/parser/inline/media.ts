import { MediaParser } from '../inline';
import { union, inits, tails, some, syntax, creation, precedence, constraint, validate, verify, surround, open, dup, lazy, fmap, bind } from '../../combinator';
import { unsafelink, uri, option as linkoption, resolve } from './link';
import { attributes } from './html';
import { unsafehtmlentity } from './htmlentity';
import { txt, linebreak, str } from '../source';
import { Syntax, State, Recursion } from '../context';
import { markInvalid } from '../util';
import { ReadonlyURL } from 'spica/url';
import { unshift, push } from 'spica/array';
import { html, define } from 'typed-dom/dom';

const optspec = {
  'width': [],
  'height': [],
  'aspect-ratio': [],
  rel: undefined,
} as const;
Object.setPrototypeOf(optspec, null);

export const media: MediaParser = lazy(() => validate(['![', '!{'], creation(1, Recursion.ignore, open(
  '!',
  constraint(State.media, false,
  syntax(Syntax.none, 2, ~State.link,
  bind(verify(fmap(tails([
    dup(surround(
      '[',
      some(union([unsafehtmlentity, bracket, txt]), ']', [[/^\\?\n/, 9]]),
      ']',
      true)),
    dup(surround(/^{(?![{}])/, inits([uri, some(option)]), /^[^\S\n]*}/)),
  ]),
  ([as, bs]) => bs ? [[as.join('').trim() || as.join('')], bs] : [[''], as]),
  ([[text]]) => text === '' || text.trim() !== ''),
  ([[text], params], rest, context) => {
    assert(text === text.trim());
    const INSECURE_URI = params.shift()!;
    assert(INSECURE_URI === INSECURE_URI.trim());
    assert(!INSECURE_URI.match(/\s/));
    const url = new ReadonlyURL(
      resolve(INSECURE_URI, context.host ?? location, context.url ?? context.host ?? location),
      context.host?.href || location.href);
    let cache: HTMLElement | undefined;
    const el = undefined
      || (cache = context.caches?.media?.get(url.href)?.cloneNode(true))
      || html('img', { class: 'media', 'data-src': url.source, alt: text });
    assert(!el.matches('.invalid'));
    cache?.hasAttribute('alt') && cache?.setAttribute('alt', text);
    if (!sanitize(el, url, text)) return [[el], rest];
    assert(!el.matches('.invalid'));
    define(el, attributes('media', push([], el.classList), optspec, params));
    assert(el.matches('img') || !el.matches('.invalid'));
    // Awaiting the generic support for attr().
    if (el.hasAttribute('aspect-ratio')) {
      el.style.aspectRatio = el.getAttribute('aspect-ratio')!;
    }
    if (context.state! & State.link) return [[el], rest];
    if (cache && cache.tagName !== 'IMG') return [[el], rest];
    return fmap(
      unsafelink as MediaParser,
      ([link]) => [define(link, { class: null, target: '_blank' }, [el])])
      ({ source: `{ ${INSECURE_URI}${params.join('')} }${rest}`, context });
  })))))));

export const linemedia: MediaParser.LineMediaParser = surround(
  linebreak,
  union([media]),
  /^(?=[^\S\n]*(?:$|\n))/);

const bracket: MediaParser.TextParser.BracketParser = lazy(() => creation(0, Recursion.terminal, union([
  surround(str('('), some(union([unsafehtmlentity, bracket, txt]), ')'), str(')'), true,
    undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('['), some(union([unsafehtmlentity, bracket, txt]), ']'), str(']'), true,
    undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('{'), some(union([unsafehtmlentity, bracket, txt]), '}'), str('}'), true,
    undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('"'), precedence(3, some(union([unsafehtmlentity, txt]), '"')), str('"'), true),
])));

const option: MediaParser.ParameterParser.OptionParser = lazy(() => union([
  fmap(str(/^[^\S\n]+[1-9][0-9]*x[1-9][0-9]*(?=[^\S\n]|})/), ([opt]) => [` width="${opt.slice(1).split('x')[0]}"`, ` height="${opt.slice(1).split('x')[1]}"`]),
  fmap(str(/^[^\S\n]+[1-9][0-9]*:[1-9][0-9]*(?=[^\S\n]|})/), ([opt]) => [` aspect-ratio="${opt.slice(1).split(':').join('/')}"`]),
  linkoption,
]));

function sanitize(target: HTMLElement, uri: ReadonlyURL, alt: string): boolean {
  assert(target.tagName === 'IMG');
  assert(!target.matches('.invalid'));
  switch (uri.protocol) {
    case 'http:':
    case 'https:':
      assert(uri.host);
      if (/\/\.\.?(?:\/|$)/.test('/' + uri.source.slice(0, uri.source.search(/[?#]|$/)))) {
        markInvalid(target, 'media', 'argument',
          'Dot-segments cannot be used in media paths; use subresource paths instead');
        return false;
      }
      break;
    default:
      markInvalid(target, 'media', 'argument', 'Invalid protocol');
      return false;
  }
  if (alt.includes('\x1B')) {
    define(target, { alt: target.getAttribute('alt')?.replace(/\x1B/g, '') });
    markInvalid(target, 'media', 'content',
      `Cannot use invalid HTML entitiy "${alt.match(/&[0-9A-Za-z]+;/)![0]}"`);
    return false;
  }
  return true;
}
