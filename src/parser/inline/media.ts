import { MediaParser } from '../inline';
import { State, Recursion, Backtrack, Command } from '../context';
import { List, Data, subinput } from '../../combinator/data/parser';
import { union, inits, tails, some, creation, recursion, precedence, constraint, surround, open, setBacktrack, dup, lazy, fmap, bind } from '../../combinator';
import { unsafelink, uri, option as linkoption, resolve, decode } from './link';
import { attributes } from './html';
import { unsafehtmlentity } from './htmlentity';
import { txt, str } from '../source';
import { unwrap, invalid } from '../util';
import { ReadonlyURL } from 'spica/url';
import { html, define } from 'typed-dom/dom';

const optspec = {
  'width': [],
  'height': [],
  'aspect-ratio': [],
  rel: undefined,
} as const;
Object.setPrototypeOf(optspec, null);

export const media: MediaParser = lazy(() => constraint(State.media, creation(10, open(
  '!',
  bind(fmap(tails([
    dup(surround(
      '[',
      precedence(1, some(union([
        unsafehtmlentity,
        bracket,
        txt,
      ]), ']')),
      ']',
      true,
      [3 | Backtrack.escbracket],
      ([, ns = new List()], context) =>
        context.linebreak === 0
          ? ns
          : undefined)),
    dup(surround(
      /{(?![{}])/y,
      inits([uri, some(option)]),
      / ?}/y,
      false,
      [3 | Backtrack.link],
      undefined,
      ([as, bs], context) => {
        if (!bs) return;
        const head = context.position - context.range!;
        setBacktrack(context, [2 | Backtrack.link], head);
        return as.import(bs).push(new Data(Command.Cancel)) && as;
      })),
  ]),
  nodes =>
    nodes.length === 1
      ? new List<Data<List<Data<string>>>>([new Data(new List([new Data('')])), nodes.delete(nodes.head!)])
      : new List<Data<List<Data<string>>>>([new Data(new List([new Data(nodes.head!.value.foldl((acc, { value }) => acc + value, ''))])), nodes.delete(nodes.last!)])),
  ([{ value: [{ value: text }] }, { value: params }], context) => {
    if (text && text.trimStart() === '') return;
    text = text.trim();
    if (params.last!.value === Command.Cancel) {
      params.pop();
      return new List([
        new Data(html('span',
          {
            class: 'invalid',
            ...invalid('media', 'syntax', 'Missing the closing symbol "}"')
          },
          '!' + context.source.slice(context.position - context.range!, context.position)))
      ]);
    }
    const INSECURE_URI = params.shift()!.value;
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
    if (!sanitize(el, uri)) return new List([new Data(el)]);
    assert(!el.matches('.invalid'));
    const [attrs, linkparams] = attributes('media', optspec, unwrap(params));
    define(el, attrs);
    assert(el.matches('img') || !el.matches('.invalid'));
    // Awaiting the generic support for attr().
    if (el.hasAttribute('aspect-ratio')) {
      el.style.aspectRatio = el.getAttribute('aspect-ratio')!;
    }
    if (context.state! & State.link) return new List([new Data(el)]);
    if (cache && cache.tagName !== 'IMG') return new List([new Data(el)]);
    const { source, position } = context;
    return fmap(
      unsafelink as MediaParser,
      ([{ value }]) => {
        context.source = source;
        context.position = position;
        return new List([new Data(define(value, { class: null, target: '_blank' }, [el]))]);
      })
      (subinput(`{ ${INSECURE_URI}${linkparams.join('')} }`, context));
  })))));

const bracket: MediaParser.TextParser.BracketParser = lazy(() => recursion(Recursion.terminal, union([
  surround(str('('), some(union([unsafehtmlentity, bracket, txt]), ')'), str(')'),
    true, [3 | Backtrack.escbracket], undefined, () => new List()),
  surround(str('['), some(union([unsafehtmlentity, bracket, txt]), ']'), str(']'),
    true, [3 | Backtrack.escbracket], undefined, () => new List()),
  surround(str('{'), some(union([unsafehtmlentity, bracket, txt]), '}'), str('}'),
    true, [3 | Backtrack.escbracket], undefined, () => new List()),
  surround(str('"'), precedence(2, some(union([unsafehtmlentity, txt]), '"')), str('"'),
    true, [3 | Backtrack.escbracket], undefined, () => new List()),
])));

const option: MediaParser.ParameterParser.OptionParser = lazy(() => union([
  surround(
    open(/ /y, str(/[1-9][0-9]*/y)),
    str(/[x:]/y),
    str(/[1-9][0-9]*(?=[ }])/y),
    false, [],
    ([[{ value: a }], [{ value: b }], [{ value: c }]]) =>
      b === 'x'
        ? new List([new Data(`width="${a}"`), new Data(`height="${c}"`)])
        : new List([new Data(`aspect-ratio="${a}/${c}"`)])),
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
