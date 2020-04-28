import { location, encodeURI, decodeURI } from 'spica/global';
import { ObjectAssign, ObjectSetPrototypeOf } from 'spica/alias';
import { LinkParser, inline, media, shortmedia } from '../inline';
import { union, inits, tails, some, subline, validate, guard, context, creator, fmap, bind, surround, match, memoize, lazy, eval } from '../../combinator';
import { startTight, isTight, trimEnd, dup, defrag, stringify } from '../util';
import { str } from '../source';
import { makeAttrs } from './html';
import { autolink } from '../autolink';
import { html, define } from 'typed-dom';

const { origin } = location;

export const attributes = {
  nofollow: [void 0],
} as const;
void ObjectSetPrototypeOf(attributes, null);

export const link: LinkParser = lazy(() => subline(creator(10, validate(['[', '{'], bind(fmap(
  guard(context => context.syntax?.inline?.link ?? true,
  validate(/^(?:\[[^\n]*?\])?\{[^\n]+?\}/,
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
          link: false,
          media: false,
          annotation: false,
          reference: false,
          extension: false,
          autolink: false,
        }}},
        some(inline, /^\\?\n|^]/))),
        ']',
        true),
    ]))),
    dup(surround(/^{(?![{}])/, inits([uri, some(attribute)]), /^ ?}/)),
  ]))),
  ([as, bs]) => bs ? [as, bs] : [[], as]),
  ([content, params]: [(HTMLElement | string)[], string[]], rest, context) => {
    assert(params.every(p => typeof p === 'string'));
    if (!isTight(content, 0, content.length)) return;
    if (eval(some(autolink)(stringify(content), context), []).some(node => typeof node === 'object')) return;
    assert(!html('div', content).querySelector('a, .media, .annotation, .reference') || (content[0] as HTMLElement).matches('.media'));
    const INSECURE_URI = params.shift()!;
    assert(INSECURE_URI === INSECURE_URI.trim());
    assert(!INSECURE_URI.match(/\s/));
    const el = html('a',
      {
        href: INSECURE_URI,
        rel: `noopener${params.includes(' nofollow') ? ' nofollow noreferrer' : ''}`,
      },
      content.length > 0
        ? content = defrag(trimEnd(content))
        : decode(INSECURE_URI || '.')
            .replace(/^h(?=ttps?:\/\/[^/?#\s])/, params.includes(' nofollow') ? '' : 'h')
            .replace(/^tel:/, ''));
    if (!sanitize(el, el, INSECURE_URI)) return [[el], rest];
    void define(el, ObjectAssign(
      makeAttrs(attributes, params, [...el.classList], 'link'),
      { nofollow: void 0 }));
    return [[el], rest];
  })))));

export const uri: LinkParser.ParamParser.UriParser = union([
  match(
    /^ ?(?! )/,
    memoize(([delim]) => delim,
    delim => str(delim ? /^\S+/ : /^[^\s{}]+/)))
]);

export const attribute: LinkParser.ParamParser.AttributeParser = union([
  str(/^ [a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\n"])*")?(?=[ }])/),
]);

export function sanitize(uri: HTMLAnchorElement, target: HTMLElement, source: string): boolean {
  let type: string;
  let message: string;
  switch (uri.protocol) {
    case 'http:':
    case 'https:': {
      const { host } = uri;
      host && uri.origin !== origin && target.tagName === 'A' && void target.setAttribute('target', '_blank');
      if (host) return true;
      type = 'parameter';
      message = 'Invalid host';
      break;
    }
    case target.tagName === 'A'
      && 'tel:':
      if (`tel:${uri.textContent!.replace(/-(?=[0-9])/g, '')}` === source) return true;
      type = 'content';
      message = 'Invalid phone number';
      break;
    default:
      type = 'parameter';
      message = 'Invalid protocol';
  }
  void target.classList.toggle('invalid', true);
  void define(target, {
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
