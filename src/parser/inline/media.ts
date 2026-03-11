import { MediaParser } from '../inline';
import { State, Recursion, Backtrack, Command } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { Flag } from '../node';
import { union, inits, tails, some, consume, recursion, precedence, constraint, surround, open, setBacktrack, dup, lazy, fmap, bind } from '../../combinator';
import { uri, option as linkoption, resolve, decode, parse } from './link';
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

export const media: MediaParser = lazy(() => constraint(State.media, open(
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
      [3 | Backtrack.escapable, 2 | Backtrack.ruby],
      ([, ns = new List()], context) => {
        if (context.linebreak !== 0) {
          const head = context.position - context.range;
          return void setBacktrack(context, 2 | Backtrack.link | Backtrack.ruby, head);
        }
        return ns;
      })),
    dup(surround(
      /{(?![{}])/y,
      precedence(9, inits([uri, some(option)])),
      / ?}/y,
      false, [],
      undefined,
      ([as, bs]) =>
        bs && as.import(bs).push(new Node(Command.Cancel)) && as)),
  ]),
  nodes =>
    nodes.length === 1
      ? new List<Node<List<Node<string>>>>([new Node(new List([new Node('')])), nodes.delete(nodes.head!)])
      : new List<Node<List<Node<string>>>>([new Node(new List([new Node(nodes.head!.value.foldl((acc, { value }) => acc + value, ''), nodes.head!.value.head?.flags)])), nodes.delete(nodes.last!)])),
  ([{ value: [{ value: text, flags }] }, { value: params }], context) => {
    if (flags & Flag.invisible) return;
    if (text) {
      const tmp = text;
      text = text.trim();
      if (text === '' || text[0] !== tmp[0]) return;
    }
    consume(100, context);
    if (params.last!.value === Command.Cancel) {
      params.pop();
      return new List([
        new Node(html('span',
          {
            class: 'invalid',
            ...invalid('media', 'syntax', 'Missing the closing symbol "}"')
          },
          '!' + context.source.slice(context.position - context.range, context.position)))
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
    if (!sanitize(el, uri)) return new List([new Node(el)]);
    assert(!el.matches('.invalid'));
    const [attrs, linkparams] = attributes('media', optspec, unwrap(params));
    define(el, attrs);
    assert(el.matches('img') || !el.matches('.invalid'));
    // Awaiting the generic support for attr().
    if (el.hasAttribute('aspect-ratio')) {
      el.style.aspectRatio = el.getAttribute('aspect-ratio')!;
    }
    if (context.state & State.link) return new List([new Node(el)]);
    if (cache && cache.tagName !== 'IMG') return new List([new Node(el)]);
    return new List([new Node(define(
      parse(
        new List(),
        linkparams.reduce(
          (acc, p) => acc.push(new Node(p)) && acc,
          new List([new Node(INSECURE_URI)])),
        context),
      { class: null, target: '_blank' }, [el]))
    ]);
  }))));

const bracket: MediaParser.TextParser.BracketParser = lazy(() => recursion(Recursion.terminal, union([
  surround(str('('), some(union([unsafehtmlentity, bracket, txt]), ')'), str(')'),
    true, [3 | Backtrack.escapable], undefined, () => new List()),
  surround(str('['), some(union([unsafehtmlentity, bracket, txt]), ']'), str(']'),
    true, [3 | Backtrack.escapable], undefined, () => new List()),
  surround(str('{'), some(union([unsafehtmlentity, bracket, txt]), '}'), str('}'),
    true, [3 | Backtrack.escapable], undefined, () => new List()),
  surround(str('"'), precedence(2, some(union([unsafehtmlentity, txt]), '"')), str('"'),
    true, [3 | Backtrack.escapable], undefined, () => new List()),
])));

const option: MediaParser.ParameterParser.OptionParser = lazy(() => union([
  surround(
    open(/ /y, str(/[1-9][0-9]*/y)),
    str(/[x:]/y),
    str(/[1-9][0-9]*(?=[ }])/y),
    false, [],
    ([[{ value: a }], [{ value: b }], [{ value: c }]]) =>
      b === 'x'
        ? new List([new Node(`width="${a}"`), new Node(`height="${c}"`)])
        : new List([new Node(`aspect-ratio="${a}/${c}"`)])),
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
  define(target, {
    'data-src': null,
    class: 'invalid',
    ...invalid('link', type, message),
  });
  return false;
}
