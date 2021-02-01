import { undefined, location, encodeURI, decodeURI, Location } from 'spica/global';
import { ObjectSetPrototypeOf } from 'spica/alias';
import { LinkParser, inline, media, shortmedia } from '../inline';
import { union, inits, tails, some, validate, guard, context, creator, surround, open, reverse, lazy, fmap, bind, eval } from '../../combinator';
import { startTight, isEndTight, dup, defrag, stringify } from '../util';
import { attributes } from './html';
import { autolink } from '../autolink';
import { str } from '../source';
import { ReadonlyURL } from 'spica/url';
import { html, define } from 'typed-dom';

const optspec = {
  rel: ['nofollow noreferrer'],
} as const;
ObjectSetPrototypeOf(optspec, null);

export const link: LinkParser = lazy(() => creator(10, bind(reverse(
  validate(['[', '{'], '}', '\n',
  guard(context => context.syntax?.inline?.link ?? true,
  tails([
    context({ syntax: { inline: {
      link: false,
    }}},
    dup(union([
      surround('[', media, ']'),
      surround('[', shortmedia, ']'),
      surround(
        '[',
        startTight(
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
        some(inline, ']', /^\\?\n/))),
        ']',
        true),
    ]))),
    dup(surround(/^{(?![{}])/, inits([uri, some(option)]), /^ ?}/)),
  ])))),
  ([params, content = []]: [string[], (HTMLElement | string)[]], rest, context) => {
    assert(params.every(p => typeof p === 'string'));
    if (!isEndTight(content)) return;
    if (eval(some(autolink)(stringify(content), context), []).some(node => typeof node === 'object')) return;
    assert(!html('div', content).querySelector('a, .media, .annotation, .reference') || (content[0] as HTMLElement).matches('.media'));
    const INSECURE_URI = params.shift()!;
    if (INSECURE_URI[0] === ' ') return;
    assert(INSECURE_URI === INSECURE_URI.trim());
    assert(!INSECURE_URI.match(/\s/));
    const src = resolve(INSECURE_URI, context.host || location, context.url || location);
    const el = html('a',
      {
        href: src,
      },
      content.length > 0
        ? content = defrag(content)
        : decode(INSECURE_URI.replace(/^tel:/i, '')));
    if (!sanitize(new ReadonlyURL(src, context.host?.href || location.href), el, INSECURE_URI, context.host?.origin || location.origin)) return [[el], rest];
    assert(el.classList.length === 0);
    define(el, attributes('link', [], optspec, params));
    return [[el], rest];
  })));

export const uri: LinkParser.ParameterParser.UriParser = union([
  open(' ', str(/^\S+/)),
  str(/^[^\s{}]+/),
  str(' '),
]);

export const option: LinkParser.ParameterParser.OptionParser = union([
  fmap(str(/^ nofollow(?=[ }])/), () => [` rel="nofollow noreferrer"`]),
  str(/^ [a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\n"])*")?(?=[ }])/),
  fmap(str(/^ [^\n{}]+/), opt => [` \\${opt.slice(1)}`]),
]);

export function resolve(uri: string, host: URL | Location, source: URL | Location): string {
  assert(uri);
  assert(uri === uri.trim());
  switch (true) {
    case uri.slice(0, 2) === '^/':
      const filename = host.pathname.slice(host.pathname.lastIndexOf('/') + 1);
      return filename.indexOf('.') > -1
        ? `${host.pathname.slice(0, -filename.length)}${uri.slice(2)}`
        : `${fillTrailingSlash(host.pathname)}${uri.slice(2)}`;
    case host.origin === source.origin
      && host.pathname === source.pathname:
    case uri.slice(0, 2) === '//':
      return uri;
    default:
      const target = new ReadonlyURL(uri, source.href);
      return target.origin === uri.match(/^[A-Za-z][0-9A-Za-z.+-]*:\/\/[^/?#]*/)?.[0]
        ? uri
        : target.origin === host.origin
          ? target.href.slice(target.origin.length)
          : target.href;
  }
}

function fillTrailingSlash(pathname: string): string {
  assert(pathname);
  return pathname[pathname.length - 1] === '/'
    ? pathname
    : pathname + '/';
}

export function sanitize(uri: ReadonlyURL, target: HTMLElement, source: string, origin: string): boolean {
  let type: string;
  let description: string;
  switch (uri.protocol) {
    case 'http:':
    case 'https:':
      uri.origin !== origin && target.tagName === 'A' && target.setAttribute('target', '_blank');
      assert(uri.host);
      return true;
    case 'tel:':
      if (target.tagName !== 'A') break;
      if (`tel:${target.textContent!.replace(/(?!^)-(?!-|$)/g, '')}` ===
          source.replace(/^tel:[0-9-]*[^0-9-]\w*/i, '').toLowerCase()) return true;
      type = 'content';
      description = 'Invalid phone number.';
      break;
  }
  type ??= 'argument';
  description ??= 'Invalid protocol.';
  assert(!target.classList.contains('invalid'));
  define(target, {
    class: void target.classList.add('invalid'),
    'data-invalid-syntax': 'link',
    'data-invalid-type': type,
    'data-invalid-description': description,
    ...target.tagName === 'A'
      ? {
          href: null,
          rel: null,
        }
      : undefined,
  });
  return false;
}

function decode(uri: string): string {
  if (uri.indexOf('%') === -1) return uri;
  try {
    uri = decodeURI(uri);
  }
  finally {
    return uri.replace(/\s+/g, encodeURI);
  }
}
