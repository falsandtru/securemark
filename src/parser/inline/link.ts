import { undefined, location, encodeURI, decodeURI, Location } from 'spica/global';
import { MarkdownParser } from '../../../markdown';
import { LinkParser } from '../inline';
import { Result, eval, exec } from '../../combinator/data/parser';
import { union, inits, tails, sequence, some, constraint, syntax, creation, precedence, state, validate, surround, open, dup, reverse, lazy, fmap, bind } from '../../combinator';
import { inline, media, shortmedia } from '../inline';
import { attributes } from './html';
import { autolink as autolink_ } from '../autolink';
import { unescsource, str } from '../source';
import { Syntax, State } from '../context';
import { trimNode } from '../visibility';
import { stringify } from '../util';
import { html, define, defrag } from 'typed-dom/dom';
import { ReadonlyURL } from 'spica/url';

const optspec = {
  rel: ['nofollow'],
} as const;
Object.setPrototypeOf(optspec, null);

export const link: LinkParser = lazy(() => validate(['[', '{'], union([
  medialink,
  textlink,
])));

const textlink: LinkParser.TextLinkParser = lazy(() =>
  constraint(State.link, false,
  syntax(Syntax.link, 2, 10, State.linkable,
  bind(reverse(tails([
    dup(surround(
      '[',
      some(union([inline]), ']', [[/^\\?\n/, 9], [']', 2]]),
      ']',
      true)),
    dup(surround(/^{(?![{}])/, inits([uri, some(option)]), /^[^\S\n]*}/)),
  ])),
  ([params, content = []]: [string[], (HTMLElement | string)[]], rest, context) => {
    assert(!html('div', content).querySelector('a, .media, .annotation, .reference'));
    return parse(content, params, rest, context);
  }))));

const medialink: LinkParser.MediaLinkParser = lazy(() =>
  constraint(State.link | State.media, false,
  syntax(Syntax.link, 2, 10, State.linkable ^ State.media,
  bind(reverse(sequence([
    dup(surround(
      '[',
      union([media, shortmedia]),
      ']')),
    dup(surround(/^{(?![{}])/, inits([uri, some(option)]), /^[^\S\n]*}/)),
  ])),
  ([params, content = []]: [string[], (HTMLElement | string)[]], rest, context) =>
    parse(content, params, rest, context)))));

export const unsafelink: LinkParser.UnsafeLinkParser = lazy(() =>
  creation(10, precedence(2,
  bind(reverse(tails([
    dup(surround(
      '[',
      some(union([unescsource]), ']'),
      ']')),
    dup(surround(/^{(?![{}])/, inits([uri, some(option)]), /^[^\S\n]*}/)),
  ])),
  ([params, content = []], rest, context) =>
    parse(content, params, rest, context)))));

export const uri: LinkParser.ParameterParser.UriParser = union([
  open(/^[^\S\n]+/, str(/^\S+/)),
  str(/^[^\s{}]+/),
]);

export const option: LinkParser.ParameterParser.OptionParser = union([
  fmap(str(/^[^\S\n]+nofollow(?=[^\S\n]|})/), () => [` rel="nofollow"`]),
  str(/^[^\S\n]+[a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\\\n"])*")?(?=[^\S\n]|})/),
  fmap(str(/^[^\S\n]+[^\s{}]+/), opt => [` \\${opt.slice(1)}`]),
]);

const autolink = state(State.autolink, false, state(State.shortcut, autolink_));

function parse(
  content: (string | HTMLElement)[],
  params: string[],
  rest: string,
  context: MarkdownParser.Context,
): Result<HTMLAnchorElement, MarkdownParser.Context> {
  assert(params.length > 0);
  assert(params.every(p => typeof p === 'string'));
  if (content.length !== 0 && trimNode(content).length === 0) return;
  content = defrag(content);
  for (let source = stringify(content); source;) {
    if (/^[a-z][0-9a-z]*(?:[-.][0-9a-z]+)*:\/\/[^/?#]/i.test(source)) return;
    const result = autolink({ source, context });
    if (typeof eval(result, [])[0] === 'object') return;
    source = exec(result, '');
  }
  const INSECURE_URI = params.shift()!;
  assert(INSECURE_URI === INSECURE_URI.trim());
  assert(!INSECURE_URI.match(/\s/));
  const uri = new ReadonlyURL(
    resolve(INSECURE_URI, context.host ?? location, context.url ?? context.host ?? location),
    context.host?.href || location.href);
  switch (uri.protocol) {
    case 'tel:': {
      const tel = content.length === 0
        ? INSECURE_URI
        : content[0];
      const pattern = /^(?:tel:)?(?:\+(?!0))?\d+(?:-\d+)*$/i;
      if (content.length <= 1 &&
          typeof tel === 'string' &&
          pattern.test(tel) &&
          pattern.test(INSECURE_URI) &&
          tel.replace(/[^+\d]/g, '') === INSECURE_URI.replace(/[^+\d]/g, '')) {
        break;
      }
      return;
    }
  }
  const el = elem(
    INSECURE_URI,
    content,
    uri,
    context.host?.origin || location.origin);
  if (el.className === 'invalid') return [[el], rest];
  return [[define(el, attributes('link', [], optspec, params))], rest];
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
      if (INSECURE_URI.slice(0, 2) === '^/' &&
          /\/\.\.?(?:\/|$)/.test(INSECURE_URI.slice(0, INSECURE_URI.search(/[?#]|$/)))) {
        type = 'argument';
        message = 'Dot-segments cannot be used in subresource paths';
        break;
      }
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
    case 'tel:':
      assert(content.length <= 1);
      return html('a',
        {
          class: 'tel',
          href: uri.source,
        },
        content.length === 0
          ? [INSECURE_URI]
          : content);
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
          && /^[0-9]*[A-Za-z][0-9A-Za-z]*$/.test(last.slice(last.lastIndexOf('.') + 1))
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
  const origin = uri.match(/^[a-z](?:[-.](?=\w)|[0-9a-z])*:\/\/[^/?#]*/i)?.[0] ?? '';
  try {
    let path = decodeURI(uri.slice(origin.length));
    if (!origin && /^[a-z](?:[-.](?=\w)|[0-9a-z])*:\/\/[^/?#]/i.test(path)) {
      path = uri.slice(origin.length);
    }
    uri = origin + path;
  }
  finally {
    return uri.replace(/\s+/g, encodeURI);
  }
}
