import { MediaParser } from '../inline';
import { State, Recursion, Backtrack, Command } from '../context';
import { Result, List, Node } from '../../combinator/parser';
import { Flag } from '../node';
import { union, inits, tails, some, recursion, precedence, constraint, backtrack, surround, open, setBacktrack, dup, lazy, fmap, bind } from '../../combinator';
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

export const media: MediaParser = lazy(() => constraint(State.media, backtrack(open(
  '!',
  bind(fmap(tails([
    backtrack(dup(surround(
      '[',
      precedence(1, some(union([
        unsafehtmlentity,
        bracket,
        txt,
      ]), ']')),
      ']',
      true,
      [3 | Backtrack.escapable, 2 | Backtrack.ruby],
      ([, ns = new List()], input, output) => {
        if (input.linebreak !== 0 || ns.head?.flags! & Flag.blank || ns.head?.value?.[0].trimStart() === '') {
          const head = input.position - input.range;
          return void setBacktrack(input, 2 | Backtrack.escapable | Backtrack.ruby, head);
        }
        return output.import(ns);
      }))),
    backtrack(dup(surround(
      /{(?![{}])/y,
      inits([uri, some(option)]),
      / ?}/y,
      false, [],
      undefined,
      ([as, bs], _, output) =>
        bs && output.import(as.import(bs).push(new Node(Command.Cancel)))))),
  ]),
  nodes =>
    nodes.length === 1
      ? new List<Node<List<Node<string>>>>([new Node(new List([new Node('')])), nodes.delete(nodes.head!)])
      : new List<Node<List<Node<string>>>>([new Node(new List([new Node(nodes.head!.value.foldl((acc, { value }) => acc + value, '').trimEnd(), nodes.head!.value.head?.flags)])), nodes.delete(nodes.last!)])),
  ([{ value: [{ value: text }] }, { value: params }], input) => {
    assert(text === text.trim());
    if (params.last!.value === Command.Cancel) {
      params.pop();
      return new List([
        new Node(html('span',
          {
            class: 'invalid',
            ...invalid('media', 'syntax', 'Missing the closing symbol "}"')
          },
          '!' + input.source.slice(input.position - input.range, input.position)))
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
        resolve(INSECURE_URI, input.host ?? location, input.url ?? input.host ?? location),
        input.host?.href || location.href);
    }
    catch {
    }
    let cache: HTMLElement | undefined;
    const el = undefined
      || uri && (cache = input.caches?.media?.get(uri.href)?.cloneNode(true))
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
    if (input.state & State.link) return new List([new Node(el)]);
    if (cache && cache.tagName !== 'IMG') return new List([new Node(el)]);
    return new List([new Node(define(
      parse(
        new List(),
        linkparams.reduce(
          (acc, p) => acc.push(new Node(p)) && acc,
          new List([new Node(INSECURE_URI)])),
        input),
      { class: null, target: '_blank' }, [el]))
    ]);
  })))));

const bracket: MediaParser.TextParser.BracketParser = lazy(() => union([
  surround(str('('), recursion(Recursion.bracket, some(union([unsafehtmlentity, bracket, txt]), ')')), str(')'),
    true, [], undefined, () => Result.succ),
  surround(str('['), recursion(Recursion.bracket, some(union([unsafehtmlentity, bracket, txt]), ']')), str(']'),
    true, [], undefined, () => Result.succ),
  surround(str('{'), recursion(Recursion.bracket, some(union([unsafehtmlentity, bracket, txt]), '}')), str('}'),
    true, [], undefined, () => Result.succ),
  surround(str('"'), precedence(2, recursion(Recursion.bracket, some(union([unsafehtmlentity, txt]), '"'))), str('"'),
    true, [], undefined, () => Result.succ),
]));

const option: MediaParser.ParameterParser.OptionParser = lazy(() => union([
  backtrack(surround(
    open(/ /y, str(/[1-9][0-9]*/y)),
    str(/[x:]/y),
    str(/[1-9][0-9]*(?=[ }])/y),
    false, [],
    ([[{ value: a }], [{ value: b }], [{ value: c }]], _, output) =>
      b === 'x'
        ? output.import(new List([new Node(`width="${a}"`), new Node(`height="${c}"`)]))
        : output.import(new List([new Node(`aspect-ratio="${a}/${c}"`)])))),
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
