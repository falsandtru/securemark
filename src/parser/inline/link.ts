import { MarkdownParser } from '../../../markdown';
import { LinkParser } from '../inline';
import { State, Recursion, Backtrack } from '../context';
import { union, inits, tails, sequence, some, constraint, syntax, creation, precedence, validate, surround, open, dup, reverse, lazy, fmap, bind } from '../../combinator';
import { inline, media, shortmedia } from '../inline';
import { attributes } from './html';
import { linebreak, unescsource, str } from '../source';
import { trimBlankStart, trimNodeEnd } from '../visibility';
import { stringify } from '../util';
import { ReadonlyURL } from 'spica/url';
import { html, define, defrag } from 'typed-dom/dom';

const optspec = {
  rel: ['nofollow'],
} as const;
Object.setPrototypeOf(optspec, null);

export const textlink: LinkParser.TextLinkParser = lazy(() => validate(['[', '{'], creation(1, Recursion.ignore,
  constraint(State.link, false,
  syntax(1, State.linkers | State.media,
  bind(reverse(tails([
    dup(surround(
      '[',
      trimBlankStart(some(union([inline]), ']', [['\n', 9], [']', 1]])),
      ']',
      true, undefined, undefined, 1 | Backtrack.bracket)),
    dup(surround(
      /^{(?![{}])/,
      inits([uri, some(option)]),
      /^[^\S\n]*}/,
      false, undefined, undefined, 3 | Backtrack.link)),
  ])),
  ([params, content = []]: [string[], (HTMLElement | string)[]], rest, context) => {
    assert(!html('div', content).querySelector('a, .media, .annotation, .reference'));
    assert(content[0] !== '');
    if (content.length !== 0 && trimNodeEnd(content = defrag(content)).length === 0) return;
    return [[parse(content, params, context)], rest];
  }))))));

export const medialink: LinkParser.MediaLinkParser = lazy(() => validate(['[', '{'], creation(1, Recursion.ignore,
  constraint(State.link | State.media, false,
  syntax(1, State.linkers,
  bind(reverse(sequence([
    dup(surround(
      '[',
      union([media, shortmedia]),
      ']')),
    dup(surround(/^{(?![{}])/, inits([uri, some(option)]), /^[^\S\n]*}/)),
  ])),
  ([params, content = []]: [string[], (HTMLElement | string)[]], rest, context) =>
    [[parse(defrag(content), params, context)], rest]))))));

export const linemedialink: LinkParser.LineMediaLinkParser = surround(
  linebreak,
  union([medialink]),
  /^(?=[^\S\n]*(?:$|\n))/);

export const unsafelink: LinkParser.UnsafeLinkParser = lazy(() =>
  creation(1, Recursion.ignore,
  precedence(1,
  bind(reverse(tails([
    dup(surround(
      '[',
      some(union([unescsource]), ']'),
      ']')),
    dup(surround(/^{(?![{}])/, inits([uri, some(option)]), /^[^\S\n]*}/)),
  ])),
  ([params, content = []], rest, context) =>
    [[parse(defrag(content), params, context)], rest]))));

export const uri: LinkParser.ParameterParser.UriParser = union([
  open(/^[^\S\n]+/, str(/^\S+/)),
  str(/^[^\s{}]+/),
]);

export const option: LinkParser.ParameterParser.OptionParser = union([
  fmap(str(/^[^\S\n]+nofollow(?=[^\S\n]|})/), () => [` rel="nofollow"`]),
  str(/^[^\S\n]+[a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\\\n"])*")?(?=[^\S\n]|})/),
  fmap(str(/^[^\S\n]+[^\s{}]+/), opt => [` \\${opt.slice(1)}`]),
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
  const uri = new ReadonlyURL(
    resolve(INSECURE_URI, context.host ?? location, context.url ?? context.host ?? location),
    context.host?.href || location.href);
  const el = elem(
    INSECURE_URI,
    content,
    uri,
    context.host?.origin || location.origin);
  return el.className === 'invalid'
    ? el
    : define(el, attributes('link', [], optspec, params));
}

function elem(
  INSECURE_URI: string,
  content: readonly (string | HTMLElement)[],
  uri: ReadonlyURL,
  origin: string,
): HTMLAnchorElement {
  let type: string;
  let message: string;
  switch (uri.protocol) {
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
  }
  return html('a',
    {
      class: 'invalid',
      'data-invalid-syntax': 'link',
      'data-invalid-type': type ??= 'argument',
      'data-invalid-message': message ??= 'Invalid protocol',
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

function decode(uri: string): string {
  if (!uri.includes('%')) return uri;
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
