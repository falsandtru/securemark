import { undefined, location, encodeURI, decodeURI, Location } from 'spica/global';
import { LinkParser, TextLinkParser } from '../inline';
import { Result, eval } from '../../combinator/data/parser';
import { union, inits, tails, subsequence, some, validate, guard, context, precedence, creator, surround, open, dup, reverse, lazy, fmap, bind } from '../../combinator';
import { inline, media, shortmedia } from '../inline';
import { attributes } from './html';
import { autolink } from '../autolink';
import { unescsource, str } from '../source';
import { trimNode, stringify } from '../util';
import { html, define, defrag } from 'typed-dom/dom';
import { ReadonlyURL } from 'spica/url';

const optspec = {
  rel: ['nofollow'],
} as const;
Object.setPrototypeOf(optspec, null);

export const link: LinkParser = lazy(() => validate(['[', '{'], creator(10, precedence(2, bind(
  guard(context => context.syntax?.inline?.link ?? true,
  fmap(subsequence([
    context({ syntax: { inline: {
      link: false,
    }}},
    dup(union([
      surround('[', media, ']'),
      surround('[', shortmedia, ']'),
      surround(
        '[',
        context({ syntax: { inline: {
          annotation: false,
          reference: false,
          index: false,
          label: false,
          // Redundant
          //link: false,
          media: false,
          autolink: false,
        }}},
        some(inline, ']', [[/^\\?\n/, 9], [']', 2]])),
        ']',
        true,
        undefined,
        ([, ns = [], rest], next) => next[0] === ']' ? undefined : optimize('[', ns, rest)),
    ]))),
    // 全体の失敗が確定した時も解析し予算を浪費している
    dup(surround(/^{(?![{}])/, inits([uri, some(option)]), /^[^\S\n]*}/)),
  ]),
  ([as, bs = []]) => bs[0] === '\r' && bs.shift() ? [as, bs] : as[0] === '\r' && as.shift() ? [[], as] : [as, []])),
  ([content, params]: [(HTMLElement | string)[], string[]], rest, context) => {
    if (params.length === 0) return;
    assert(content[0] !== '' || params.length === 0);
    if (content[0] === '') return [content, rest];
    assert(params.every(p => typeof p === 'string'));
    if (content.length !== 0 && trimNode(content).length === 0) return;
    if (eval(some(autolink)(stringify(content), context))?.some(node => typeof node === 'object')) return;
    assert(!html('div', content).querySelector('a, .media, .annotation, .reference') || (content[0] as HTMLElement).matches('.media'));
    const INSECURE_URI = params.shift()!;
    assert(INSECURE_URI === INSECURE_URI.trim());
    assert(!INSECURE_URI.match(/\s/));
    const el = elem(
      INSECURE_URI,
      defrag(content),
      new ReadonlyURL(
        resolve(INSECURE_URI, context.host ?? location, context.url ?? context.host ?? location),
        context.host?.href || location.href),
      context.host?.origin || location.origin);
    if (el.classList.contains('invalid')) return [[el], rest];
    assert(el.classList.length === 0);
    return [[define(el, attributes('link', [], optspec, params))], rest];
  })))));

export const textlink: TextLinkParser = lazy(() => validate(['[', '{'], creator(10, precedence(2, bind(
  reverse(tails([
    dup(surround('[', some(union([unescsource]), ']'), ']')),
    dup(surround(/^{(?![{}])/, inits([uri, some(option)]), /^[^\S\n]*}/)),
  ])),
  ([params, content = []], rest, context) => {
    assert(params[0] === '\r');
    params.shift();
    assert(params.every(p => typeof p === 'string'));
    trimNode(content);
    const INSECURE_URI = params.shift()!;
    assert(INSECURE_URI === INSECURE_URI.trim());
    assert(!INSECURE_URI.match(/\s/));
    const el = elem(
      INSECURE_URI,
      defrag(content),
      new ReadonlyURL(
        resolve(INSECURE_URI, context.host ?? location, context.url ?? context.host ?? location),
        context.host?.href || location.href),
      context.host?.origin || location.origin);
    assert(!el.classList.contains('invalid'));
    assert(el.classList.length === 0);
    return [[define(el, attributes('link', [], optspec, params))], rest];
  })))));

export const uri: LinkParser.ParameterParser.UriParser = fmap(union([
  open(/^[^\S\n]+/, str(/^\S+/)),
  str(/^[^\s{}]+/),
]), ([uri]) => ['\r', uri]);

export const option: LinkParser.ParameterParser.OptionParser = union([
  fmap(str(/^[^\S\n]+nofollow(?=[^\S\n]|})/), () => [` rel="nofollow"`]),
  str(/^[^\S\n]+[a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\\\n"])*")?(?=[^\S\n]|})/),
  fmap(str(/^[^\S\n]+[^\s{}]+/), opt => [` \\${opt.slice(1)}`]),
]);

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
      if (content.length === 0) {
        content = [INSECURE_URI];
      }
      const pattern = /^(?:tel:)?(?:\+(?!0))?\d+(?:-\d+)*$/i;
      switch (true) {
        case content.length === 1
          && typeof content[0] === 'string'
          && pattern.test(INSECURE_URI)
          && pattern.test(content[0])
          && INSECURE_URI.replace(/[^+\d]/g, '') === content[0].replace(/[^+\d]/g, ''):
          return html('a', { href: uri.source }, content);
      }
      type = 'content';
      message = 'Invalid phone number';
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

function decode(uri: string): string {
  if (!uri.includes('%')) return uri;
  try {
    uri = decodeURI(uri);
  }
  finally {
    return uri.replace(/\s+/g, encodeURI);
  }
}

export function optimize(opener: string, ns: readonly (string | HTMLElement)[], rest: string): Result<string> {
  let count = 0;
  for (let i = 0; i < ns.length - 1; i += 2) {
    if (ns[i] !== '' || ns[i + 1] !== opener[0]) break;
    ++count;
  }
  return [['', opener[0].repeat(opener.length + count)], rest.slice(count)];
}
