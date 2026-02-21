import { MediaParser } from '../inline';
import { State, Recursion, Backtrack, Command } from '../context';
import { subinput } from '../../combinator/data/parser';
import { union, inits, tails, some, creation, recursion, precedence, constraint, validate, verify, surround, open, setBacktrack, dup, lazy, fmap, bind } from '../../combinator';
import { unsafelink, uri, option as linkoption, resolve, decode } from './link';
import { attributes } from './html';
import { unsafehtmlentity } from './htmlentity';
import { txt, str } from '../source';
import { invalid } from '../util';
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

export const media: MediaParser = lazy(() => constraint(State.media, validate(/![[{]/y, creation(10, open(
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
      /{(?![{}])/y,
      inits([uri, some(option)]),
      /[^\S\n]*}/y,
      false,
      undefined,
      ([as, bs], context) => {
        if (!bs) return;
        const head = context.position - context.range!;
        setBacktrack(context, [2 | Backtrack.link], head);
        return [push(unshift(as, bs), [Command.Cancel])];
      },
      [3 | Backtrack.link])),
  ]),
  ([as, bs]) => bs ? [[as.join('').trim() || as.join('')], bs] : [[''], as]),
  ([[text]]) => text === '' || text.trim() !== ''),
  ([[text], params], context) => {
    if (params.at(-1) === Command.Cancel) {
      params.pop();
      return [[
        html('span',
          {
            class: 'invalid',
            ...invalid('media', 'syntax', 'Missing the closing symbol "}"')
          },
          '!' + context.source.slice(context.position - context.range!, context.position))
      ]];
    }
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
      (subinput(`{ ${INSECURE_URI}${params.join('')} }`, context));
  }))))));

export const linemedia: MediaParser.LineMediaParser = surround(
  /(?<=^|[\r\n])/y,
  union([media]),
  /(?=[^\S\n]*(?:$|\n))/y);

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
    open(/[^\S\n]+/y, str(/[1-9][0-9]*/y)),
    str(/[x:]/y),
    str(/[1-9][0-9]*(?=[^\S\n]|})/y),
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
