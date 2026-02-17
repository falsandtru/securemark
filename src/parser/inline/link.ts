import { MarkdownParser } from '../../../markdown';
import { LinkParser } from '../inline';
import { State, Backtrack, Command } from '../context';
import { union, inits, tails, sequence, subsequence, some, creation, precedence, state, constraint, validate, surround, open, setBacktrack, dup, reverse, lazy, fmap, bind } from '../../combinator';
import { inline, media, shortmedia } from '../inline';
import { attributes } from './html';
import { linebreak, unescsource, str } from '../source';
import { trimBlankStart, trimBlankNodeEnd } from '../visibility';
import { invalid, stringify } from '../util';
import { ReadonlyURL } from 'spica/url';
import { push } from 'spica/array';
import { html, define, defrag } from 'typed-dom/dom';

const optspec = {
  rel: ['nofollow'],
} as const;
Object.setPrototypeOf(optspec, null);

export const textlink: LinkParser.TextLinkParser = lazy(() => constraint(State.link, creation(10,
  precedence(1, state(State.linkers,
  bind(subsequence([
    dup(surround(
      '[',
      trimBlankStart(some(union([inline]), ']', [[']', 1]])),
      ']',
      true,
      ([, ns = []], context) =>
        context.linebreak === 0
          ? [push(ns, [Command.Escape])]
          : undefined,
      undefined,
      [3 | Backtrack.link, 2 | Backtrack.ruby, 3 | Backtrack.bracket])),
    // `{ `と`{`で個別にバックトラックが発生し+1nされる。
    // 自己再帰的にパースしてもオプションの不要なパースによる計算量の増加により相殺される。
    dup(surround(
      /^{(?![{}])/,
      inits([uri, some(option)]),
      /^[^\S\n]*}/,
      false, undefined, undefined,
      [3 | Backtrack.link])),
  ]),
  ([content, params]: [(HTMLElement | string)[], string[]], context) => {
    if (content.at(-1) === Command.Escape) {
      content.pop();
      if (params === undefined) {
        const head = context.position - context.range!;
        return void setBacktrack(context, [2 | Backtrack.link], head);
      }
    }
    else {
      params = content as string[];
      content = [];
    }
    assert(!html('div', content).querySelector('a, .media, .annotation, .reference'));
    assert(content[0] !== '');
    if (content.length !== 0 && trimBlankNodeEnd(content).length === 0) return;
    return [[parse(defrag(content), params, context)]];
  }))))));

export const medialink: LinkParser.MediaLinkParser = lazy(() => constraint(State.link | State.media, validate(['[', '{'], creation(10,
  state(State.linkers,
  bind(reverse(sequence([
    dup(surround(
      '[',
      union([media, shortmedia]),
      ']')),
    dup(surround(/^{(?![{}])/, inits([uri, some(option)]), /^[^\S\n]*}/)),
  ])),
  ([params, content = []]: [string[], (HTMLElement | string)[]], context) =>
    [[parse(defrag(content), params, context)]]))))));

export const linemedialink: LinkParser.LineMediaLinkParser = surround(
  linebreak,
  union([medialink]),
  /^(?=[^\S\n]*(?:$|\n))/);

export const unsafelink: LinkParser.UnsafeLinkParser = lazy(() =>
  creation(10,
  bind(reverse(tails([
    dup(surround(
      '[',
      some(union([unescsource]), ']'),
      ']')),
    dup(surround(/^{(?![{}])/, inits([uri, some(option)]), /^[^\S\n]*}/)),
  ])),
  ([params, content = []], context) =>
    [[parse(defrag(content), params, context)]])));

export const uri: LinkParser.ParameterParser.UriParser = union([
  open(/^[^\S\n]+/, str(/^\S+/)),
  str(/^[^\s{}]+/),
]);

export const option: LinkParser.ParameterParser.OptionParser = union([
  fmap(str(/^[^\S\n]+nofollow(?=[^\S\n]|})/), () => [` rel="nofollow"`]),
  str(/^[^\S\n]+[a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\\\n"])*")?(?=[^\S\n]|})/i),
  str(/^[^\S\n]+[^\s{}]+/),
]);

function parse(
  content: readonly (string | HTMLElement)[],
  params: string[],
  context: MarkdownParser.Context,
): HTMLAnchorElement {
  assert(params.length > 0);
  assert(params.every(p => typeof p === 'string'));
  const INSECURE_URI = params.shift()!;
  assert(INSECURE_URI === INSECURE_URI.trim());
  assert(!INSECURE_URI.match(/\s/));
  let uri: ReadonlyURL | undefined;
  try{
    uri = new ReadonlyURL(
      resolve(INSECURE_URI, context.host ?? location, context.url ?? context.host ?? location),
      context.host?.href || location.href);
  }
  catch {
  }
  const el = elem(
    INSECURE_URI,
    content,
    uri,
    context.host?.origin || location.origin);
  return el.classList.contains('invalid')
    ? el
    : define(el, attributes('link', optspec, params));
}

function elem(
  INSECURE_URI: string,
  content: readonly (string | HTMLElement)[],
  uri: ReadonlyURL | undefined,
  origin: string,
): HTMLAnchorElement {
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
      switch (true) {
        case /[a-z][0-9]*:\/{0,2}\S/i.test(stringify(content)):
          type = 'content';
          message = 'URI must not be contained';
          break;
        case INSECURE_URI.slice(0, 2) === '^/'
          && /\/\.\.?(?:\/|$)/.test(INSECURE_URI.slice(0, INSECURE_URI.search(/[?#]|$/))):
          type = 'argument';
          message = 'Dot-segments cannot be used in subresource paths';
          break;
        default:
          return html('a',
            {
              class: content.length === 0 ? 'url' : 'link',
              href: uri.source,
              target: undefined
                || uri.origin !== origin
                || typeof content[0] === 'object' && content[0].classList.contains('media')
                  ? '_blank'
                  : undefined,
            },
            content.length === 0
              ? decode(INSECURE_URI)
              : content);
      }
      break;
    case 'tel:':
      assert(content.length <= 1);
      const tel = content.length === 0
        ? INSECURE_URI
        : content[0];
      const pattern = /^(?:tel:)?(?:\+(?!0))?\d+(?:-\d+)*$/i;
      switch (true) {
        case content.length <= 1
          && pattern.test(INSECURE_URI)
          && typeof tel === 'string'
          && pattern.test(tel)
          && tel.replace(/[^+\d]/g, '') === INSECURE_URI.replace(/[^+\d]/g, ''):
          return html('a',
            {
              class: 'tel',
              href: uri.source,
            },
            content.length === 0
              ? [INSECURE_URI]
              : content);
        default:
          type = 'content';
          message = 'Invalid content';
      }
      break;
    default:
      type = 'argument';
      message = 'Invalid protocol';
  }
  return html('a',
    {
      class: 'invalid',
      ...invalid('link', type, message),
    },
    content.length === 0
      ? INSECURE_URI
      : content);
}

export function resolve(uri: string, host: URL | Location, source: URL | Location): string {
  assert(uri);
  assert(uri === uri.trim());
  switch (true) {
    case uri.slice(0, 2) === '^/':
      const last = host.pathname.slice(host.pathname.lastIndexOf('/') + 1);
      return last.includes('.') // isFile
          // Exclude ISO 6709.
          && /^[0-9]*[a-z][0-9a-z]*$/i.test(last.slice(last.lastIndexOf('.') + 1))
        ? `${host.pathname.slice(0, -last.length)}${uri.slice(2)}`
        : `${host.pathname.replace(/\/?$/, '/')}${uri.slice(2)}`;
    case host.origin === source.origin
      && host.pathname === source.pathname:
    case uri.slice(0, 2) === '//':
      return uri;
    default:
      const target = new ReadonlyURL(uri, source.href);
      return target.origin === host.origin
        ? target.href.slice(target.origin.length)
        : target.href;
  }
}

export function decode(uri: string): string {
  const origin = uri.match(/^[a-z](?:[-.](?=[0-9a-z])|[0-9a-z])*:(?:\/{0,2}[^/?#\s]+|\/\/(?=[/]))/i)?.[0] ?? '';
  try {
    let path = decodeURI(uri.slice(origin.length));
    if (!origin && /^[a-z](?:[-.](?=[0-9a-z])|[0-9a-z])*:\/{0,2}\S/i.test(path)) {
      path = uri.slice(origin.length);
    }
    uri = origin + path;
  }
  finally {
    return uri.replace(/\s+/g, encodeURI);
  }
}
