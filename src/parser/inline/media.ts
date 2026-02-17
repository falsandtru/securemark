import { MediaParser } from '../inline';
import { State, Recursion, Backtrack } from '../context';
import { input } from '../../combinator/data/parser';
import { union, inits, tails, some, creation, recursion, precedence, constraint, validate, verify, surround, open, dup, lazy, fmap, bind } from '../../combinator';
import { unsafelink, uri, option as linkoption, resolve, decode } from './link';
import { attributes } from './html';
import { unsafehtmlentity } from './htmlentity';
import { txt, linebreak, str } from '../source';
import { invalid } from '../util';
import { ReadonlyURL } from 'spica/url';
import { html, define } from 'typed-dom/dom';

const optspec = {
  'width': [],
  'height': [],
  'aspect-ratio': [],
  rel: undefined,
} as const;
Object.setPrototypeOf(optspec, null);

export const media: MediaParser = lazy(() => constraint(State.media, validate(['![', '!{'], creation(10, open(
  '!',
  bind(verify(fmap(tails([
    dup(surround(
      '[',
      precedence(1, some(union([
        unsafehtmlentity,
        bracket,
        txt,
      ]), ']')),
      ']',
      true,
      ([, ns = []], context) =>
        context.linebreak === 0
          ? [ns]
          : undefined,
      undefined,
      [3 | Backtrack.escbracket])),
    dup(surround(
      /^{(?![{}])/,
      inits([uri, some(option)]),
      /^[^\S\n]*}/,
      false, undefined, undefined,
      [3 | Backtrack.link])),
  ]),
  ([as, bs]) => bs ? [[as.join('').trim() || as.join('')], bs] : [[''], as]),
  ([[text]]) => text === '' || text.trim() !== ''),
  ([[text], params], context) => {
    assert(text === text.trim());
    const INSECURE_URI = params.shift()!;
    assert(INSECURE_URI === INSECURE_URI.trim());
    assert(!INSECURE_URI.match(/\s/));
    // altが空だとエラーが見えないため埋める。
    text ||= decode(INSECURE_URI);
    let uri: ReadonlyURL | undefined;
    try {
      uri = new ReadonlyURL(
        resolve(INSECURE_URI, context.host ?? location, context.url ?? context.host ?? location),
        context.host?.href || location.href);
    }
    catch {
    }
    let cache: HTMLElement | undefined;
    const el = undefined
      || uri && (cache = context.caches?.media?.get(uri.href)?.cloneNode(true))
      || html('img', { class: 'media', 'data-src': uri?.source });
    assert(!el.matches('.invalid'));
    el.setAttribute('alt', text);
    if (!sanitize(el, uri)) return [[el]];
    assert(!el.matches('.invalid'));
    define(el, attributes('media', optspec, params));
    assert(el.matches('img') || !el.matches('.invalid'));
    // Awaiting the generic support for attr().
    if (el.hasAttribute('aspect-ratio')) {
      el.style.aspectRatio = el.getAttribute('aspect-ratio')!;
    }
    if (context.state! & State.link) return [[el]];
    if (cache && cache.tagName !== 'IMG') return [[el]];
    const { source, position } = context;
    return fmap(
      unsafelink as MediaParser,
      ([link]) => {
        context.source = source;
        context.position = position;
        return [define(link, { class: null, target: '_blank' }, [el])];
      })
      (input(`{ ${INSECURE_URI}${params.join('')} }`, context));
  }))))));

export const linemedia: MediaParser.LineMediaParser = surround(
  linebreak,
  union([media]),
  /^(?=[^\S\n]*(?:$|\n))/);

const bracket: MediaParser.TextParser.BracketParser = lazy(() => recursion(Recursion.terminal, union([
  surround(str('('), some(union([unsafehtmlentity, bracket, txt]), ')'), str(')'), true,
    undefined, () => [[]], [3 | Backtrack.escbracket]),
  surround(str('['), some(union([unsafehtmlentity, bracket, txt]), ']'), str(']'), true,
    undefined, () => [[]], [3 | Backtrack.escbracket]),
  surround(str('{'), some(union([unsafehtmlentity, bracket, txt]), '}'), str('}'), true,
    undefined, () => [[]], [3 | Backtrack.escbracket]),
  surround(str('"'), precedence(2, some(union([unsafehtmlentity, txt]), '"')), str('"'), true,
    undefined, () => [[]], [3 | Backtrack.escbracket]),
])));

const option: MediaParser.ParameterParser.OptionParser = lazy(() => union([
  surround(
    open(/^[^\S\n]+/, str(/^[1-9][0-9]*/)),
    str(/^[x:]/),
    str(/^[1-9][0-9]*(?=[^\S\n]|})/),
    false,
    ([[a], [b], [c]]) => [
      b === 'x'
        ? [`width="${a}"`, `height="${c}"`]
        : [`aspect-ratio="${a}/${c}"`],
    ]),
  linkoption,
]));

function sanitize(target: HTMLElement, uri: ReadonlyURL | undefined): boolean {
  assert(target.tagName === 'IMG');
  assert(!target.matches('.invalid'));
  let type: string;
  let message: string;
  switch (uri?.protocol) {
    case undefined:
      type = 'argument';
      message = 'Invalid URI';
      break;
    case 'http:':
    case 'https:':
      assert(uri.host);
      if (!/\/\.\.?(?:\/|$)/.test('/' + uri.source.slice(0, uri.source.search(/[?#]|$/)))) return true;
      type = 'argument';
      message = 'Dot-segments cannot be used in media paths; use subresource paths instead';
      break;
    default:
      type = 'argument';
      message = 'Invalid protocol';
  }
  //else {
  //  target.setAttribute('alt', alt.replace(CmdRegExp.Error, ''));
  //  type = 'argument';
  //  message = `Invalid HTML entitiy "${alt.match(/&[0-9A-Za-z]+;/)![0]}"`;
  //}
  define(target, {
    'data-src': null,
    class: 'invalid',
    ...invalid('link', type, message),
  });
  return false;
}
