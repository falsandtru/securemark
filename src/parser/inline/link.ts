import { location, encodeURI, decodeURI, Location } from 'spica/global';
import { ObjectSetPrototypeOf } from 'spica/alias';
import { LinkParser } from '../inline';
import { eval } from '../../combinator/data/parser';
import { union, inits, tails, some, validate, guard, context, creator, surround, open, dup, reverse, lazy, fmap, bind } from '../../combinator';
import { inline, media, shortmedia } from '../inline';
import { attributes } from './html';
import { autolink } from '../autolink';
import { str } from '../source';
import { startLoose, trimNodeEnd, stringify } from '../util';
import { html, define, defrag } from 'typed-dom';
import { ReadonlyURL } from 'spica/url';

const optspec = {
  rel: ['nofollow'],
} as const;
ObjectSetPrototypeOf(optspec, null);

export const link: LinkParser = lazy(() => creator(10, validate(['[', '{'], '}', '\n', bind(
  guard(context => context.syntax?.inline?.link ?? true,
  reverse(tails([
    context({ syntax: { inline: {
      link: false,
    }}},
    dup(union([
      surround('[', media, ']'),
      surround('[', shortmedia, ']'),
      surround(
        '[',
        startLoose(
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
        open(/^[^\S\n]*/, some(inline, ']', /^\\?\n/)))),
        ']',
        true),
    ]))),
    dup(surround(/^{(?![{}])/, inits([uri, some(option)]), /^[^\S\n]*}/)),
  ]))),
  ([params, content = []]: [string[], (HTMLElement | string)[]], rest, context) => {
    assert(params.every(p => typeof p === 'string'));
    if (eval(some(autolink)(stringify(content), context))?.some(node => typeof node === 'object')) return;
    assert(!html('div', content).querySelector('a, .media, .annotation, .reference') || (content[0] as HTMLElement).matches('.media'));
    const INSECURE_URI = params.shift()!;
    assert(INSECURE_URI === INSECURE_URI.trim());
    assert(!INSECURE_URI.match(/\s/));
    const el = elem(
      INSECURE_URI,
      trimNodeEnd(defrag(content)),
      new ReadonlyURL(
        resolve(INSECURE_URI, context.host ?? location, context.url ?? context.host ?? location),
        context.host?.href || location.href),
      context.host?.origin || location.origin);
    if (el.classList.contains('invalid')) return [[el], rest];
    assert(el.classList.length === 0);
    return [[define(el, attributes('link', [], optspec, params))], rest];
  }))));

export const uri: LinkParser.ParameterParser.UriParser = union([
  open(/^[^\S\n]+/, str(/^\S+/)),
  str(/^[^\s{}]+/),
]);

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
  let description: string;
  switch (uri.protocol) {
    case 'http:':
    case 'https:':
      assert(uri.host);
      if (INSECURE_URI.slice(0, 2) === '^/' &&
          /\/\.\.?(?:\/|$)/.test(INSECURE_URI.slice(0, INSECURE_URI.search(/[?#]|$/)))) {
        type = 'argument';
        description = 'Dot-segments cannot be used in subresource paths.';
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
      description = 'Invalid phone number.';
      break;
  }
  return html('a',
    {
      class: 'invalid',
      'data-invalid-syntax': 'link',
      'data-invalid-type': type ??= 'argument',
      'data-invalid-description': description ??= 'Invalid protocol.',
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
