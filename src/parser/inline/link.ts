import { undefined, location, encodeURI, decodeURI, Location } from 'spica/global';
import { ObjectAssign, ObjectSetPrototypeOf } from 'spica/alias';
import { LinkParser, inline, media, shortmedia } from '../inline';
import { union, inits, tails, some, validate, guard, context, creator, surround, open, reverse, lazy, bind, eval } from '../../combinator';
import { startTight, isEndTight, dup, defrag, stringify } from '../util';
import { attributes } from './html';
import { autolink } from '../autolink';
import { str } from '../source';
import { URL } from 'spica/url';
import { html, define } from 'typed-dom';

export const optspec = {
  nofollow: [undefined],
} as const;
ObjectSetPrototypeOf(optspec, null);

export const link: LinkParser = lazy(() => creator(10, bind(reverse(
  validate(['[', '{'], '}', '\n',
  validate(/^(?:\[[^\n]*?\])?\{[^\n]+?\}/,
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
          link: false,
          media: false,
          autolink: false,
        }}},
        some(inline, ']', /^\\?\n/))),
        ']',
        true),
    ]))),
    dup(surround(/^{(?![{}])/, inits([uri, some(option)]), /^ ?}/)),
  ]))))),
  ([options, content = []]: [string[], (HTMLElement | string)[]], rest, context) => {
    assert(options.every(p => typeof p === 'string'));
    if (!isEndTight(content)) return;
    if (eval(some(autolink)(stringify(content), context), []).some(node => typeof node === 'object')) return;
    assert(!html('div', content).querySelector('a, .media, .annotation, .reference') || (content[0] as HTMLElement).matches('.media'));
    const INSECURE_URI = options.shift()!;
    assert(INSECURE_URI === INSECURE_URI.trim());
    assert(!INSECURE_URI.match(/\s/));
    const src = resolve(INSECURE_URI, context.host || location, context.url || location);
    const el = html('a',
      {
        href: src,
        rel: `noopener${options.includes(' nofollow') ? ' nofollow noreferrer' : ''}`,
      },
      content.length > 0
        ? content = defrag(content)
        : decode(INSECURE_URI)
            .replace(/^tel:/, ''));
    if (!sanitize(new URL(src, context.host?.href || location.href), el, INSECURE_URI, context.host?.origin || location.origin)) return [[el], rest];
    assert(el.classList.length === 0);
    define(el, ObjectAssign(
      attributes('link', optspec, options, []),
      { nofollow: undefined }));
    return [[el], rest];
  })));

export const uri: LinkParser.ParameterParser.UriParser = union([
  open(' ', str(/^\S+/)),
  str(/^[^\s{}]+/),
]);

export const option: LinkParser.ParameterParser.OptionParser = union([
  str(/^ [a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\n"])*")?(?=[ }])/),
]);

export function resolve(uri: string, host: global.URL | Location, source: global.URL | Location): string {
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
      const target = new URL(uri, source.href);
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

export function sanitize(uri: URL<string>, target: HTMLElement, text: string, origin: string): boolean {
  let type: string;
  let message: string;
  switch (uri.protocol) {
    case 'http:':
    case 'https:': {
      uri.host && uri.origin !== origin && target.tagName === 'A' && target.setAttribute('target', '_blank');
      if (uri.host) return true;
      type = 'parameter';
      message = 'Invalid host.';
      break;
    }
    case target.tagName === 'A'
      && 'tel:':
      if (`tel:${target.textContent!.replace(/-(?=[0-9])/g, '')}` === text) return true;
      type = 'content';
      message = 'Invalid phone number.';
      break;
    default:
      type = 'parameter';
      message = 'Invalid protocol.';
  }
  assert(!target.classList.contains('invalid'));
  define(target, {
    class: `${target.className} invalid`.trim(),
    'data-invalid-syntax': 'link',
    'data-invalid-type': type,
    'data-invalid-message': message,
    ...target.tagName === 'A'
      ? {
          href: null,
          rel: null,
        }
      : {
          'data-src': null,
        },
  });
  return false;
}

function decode(uri: string): string {
  try {
    uri = decodeURI(uri);
  }
  finally {
    return uri
      .replace(/\s+/g, encodeURI);
  }
}
