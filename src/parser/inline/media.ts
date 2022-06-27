import { undefined, location } from 'spica/global';
import { MediaParser } from '../inline';
import { union, inits, tails, some, creation, precedence, guard, syntax, validate, verify, surround, open, dup, lazy, fmap, bind } from '../../combinator';
import { textlink, uri, option as linkoption, resolve } from './link';
import { attributes } from './html';
import { unsafehtmlentity } from './htmlentity';
import { txt, str } from '../source';
import { Syntax, State } from '../context';
import { html, define } from 'typed-dom/dom';
import { ReadonlyURL } from 'spica/url';
import { unshift, shift, push } from 'spica/array';

const optspec = {
  'width': [],
  'height': [],
  'aspect-ratio': [],
  rel: undefined,
} as const;
Object.setPrototypeOf(optspec, null);

export const media: MediaParser = lazy(() => validate(['![', '!{'], bind(verify(fmap(open(
  '!',
  guard(context => ~context.state! & State.media,
  syntax(Syntax.media, 2, 10,
  tails([
    dup(surround(
      '[',
      some(union([unsafehtmlentity, bracket, txt]), ']', [[/^\\?\n/, 9]]),
      ']',
      true)),
    dup(surround(/^{(?![{}])/, inits([uri, some(option)]), /^[^\S\n]*}/)),
  ])))),
  ([as, bs]) => bs ? [[as.join('').trim() || as.join('')], shift(bs)[1]] : [[''], shift(as)[1]]),
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
    if (context.state! & State.link || cache && cache.tagName !== 'IMG') return [[el], rest];
    return fmap(
      textlink as MediaParser,
      ([link]) => [define(link, { target: '_blank' }, [el])])
      (`{ ${INSECURE_URI}${params.join('')} }${rest}`, context);
  })));

const bracket: MediaParser.TextParser.BracketParser = lazy(() => creation(union([
  surround(str('('), some(union([unsafehtmlentity, bracket, txt]), ')'), str(')'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('['), some(union([unsafehtmlentity, bracket, txt]), ']'), str(']'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('{'), some(union([unsafehtmlentity, bracket, txt]), '}'), str('}'), true, undefined, ([as, bs = []], rest) => [unshift(as, bs), rest]),
  surround(str('"'), precedence(8, some(union([unsafehtmlentity, txt]), '"')), str('"'), true),
])));

const option: MediaParser.ParameterParser.OptionParser = union([
  fmap(str(/^[^\S\n]+[1-9][0-9]*x[1-9][0-9]*(?=[^\S\n]|})/), ([opt]) => [` width="${opt.slice(1).split('x')[0]}"`, ` height="${opt.slice(1).split('x')[1]}"`]),
  fmap(str(/^[^\S\n]+[1-9][0-9]*:[1-9][0-9]*(?=[^\S\n]|})/), ([opt]) => [` aspect-ratio="${opt.slice(1).split(':').join('/')}"`]),
  linkoption,
]);

function sanitize(target: HTMLElement, uri: ReadonlyURL, alt: string): boolean {
  assert(target.tagName === 'IMG');
  assert(!target.matches('.invalid'));
  switch (uri.protocol) {
    case 'http:':
    case 'https:':
      assert(uri.host);
      if (/\/\.\.?(?:\/|$)/.test('/' + uri.source.slice(0, uri.source.search(/[?#]|$/)))) {
        define(target, {
          class: void target.classList.add('invalid'),
          'data-invalid-syntax': 'media',
          'data-invalid-type': 'argument',
          'data-invalid-message': 'Dot-segments cannot be used in media paths; use subresource paths instead',
        });
        return false;
      }
      break;
    default:
      define(target, {
        class: void target.classList.add('invalid'),
        'data-invalid-syntax': 'media',
        'data-invalid-type': 'argument',
        'data-invalid-message': 'Invalid protocol',
      });
      return false;
  }
  if (alt.includes('\x1B')) {
    define(target, {
      class: void target.classList.add('invalid'),
      'data-invalid-syntax': 'media',
      'data-invalid-type': 'content',
      'data-invalid-message': `Cannot use invalid HTML entitiy "${alt.match(/&[0-9A-Za-z]+;/)![0]}"`,
      alt: target.getAttribute('alt')?.replace(/\x1B/g, ''),
    });
    return false;
  }
  return true;
}
