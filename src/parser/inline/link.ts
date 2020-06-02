import { location, encodeURI, decodeURI } from 'spica/global';
import { ObjectAssign, ObjectSetPrototypeOf } from 'spica/alias';
import { LinkParser, inline, media, shortmedia } from '../inline';
import { union, inits, tails, some, subline, validate, guard, context, creator, fmap, bind, surround, match, memoize, lazy, eval } from '../../combinator';
import { startTight, isTight, trimEnd, dup, defrag, stringify } from '../util';
import { str } from '../source';
import { attributes } from './html';
import { autolink } from '../autolink';
import { html, define } from 'typed-dom';

const { origin } = location;

export const optspec = {
  nofollow: [void 0],
} as const;
void ObjectSetPrototypeOf(optspec, null);

export const link: LinkParser = lazy(() => creator(10, bind(fmap(
  validate(['[', '{'],
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
        subline(some(inline, ']')))),
        ']',
        true),
    ]))),
    dup(surround(/^{(?![{}])/, inits([uri, some(option)]), /^ ?}/)),
  ])))),
  ([as, bs]) => bs ? [as, bs] : [[], as]),
  ([content, options]: [(HTMLElement | string)[], string[]], rest, context) => {
    assert(options.every(p => typeof p === 'string'));
    if (!isTight(content, 0, content.length)) return;
    if (eval(some(autolink)(stringify(content), context), []).some(node => typeof node === 'object')) return;
    assert(!html('div', content).querySelector('a, .media, .annotation, .reference') || (content[0] as HTMLElement).matches('.media'));
    const INSECURE_URI = options.shift()!;
    assert(INSECURE_URI === INSECURE_URI.trim());
    assert(!INSECURE_URI.match(/\s/));
    const el = html('a',
      {
        href: INSECURE_URI,
        rel: `noopener${options.includes(' nofollow') ? ' nofollow noreferrer' : ''}`,
      },
      content.length > 0
        ? content = defrag(trimEnd(content))
        : decode(INSECURE_URI || '.')
            .replace(/^h(?=ttps?:\/\/[^/?#\s])/, options.includes(' nofollow') ? '' : 'h')
            .replace(/^tel:/, ''));
    if (!sanitize(el, el, INSECURE_URI)) return [[el], rest];
    assert(el.classList.length === 0);
    void define(el, ObjectAssign(
      attributes('link', optspec, options, []),
      { nofollow: void 0 }));
    return [[el], rest];
  })));

export const uri: LinkParser.ParameterParser.UriParser = union([
  match(
    /^ ?(?! )/,
    memoize(([delim]) => delim,
    delim => str(delim ? /^\S+/ : /^[^\s{}]+/)))
]);

export const option: LinkParser.ParameterParser.OptionParser = union([
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
