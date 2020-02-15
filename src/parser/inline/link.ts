import { location, encodeURI, decodeURI } from 'spica/global';
import { ObjectAssign, ObjectSetPrototypeOf } from 'spica/alias';
import { LinkParser, inline, media, shortmedia } from '../inline';
import { union, inits, tails, some, creator, backtracker, surround, match, memoize, guard, update, lazy, fmap, bind, eval } from '../../combinator';
import { defrag, startTight, dup, stringify } from '../util';
import { str, char } from '../source';
import { makeAttrs } from './html';
import { autolink } from '../autolink';
import { frag, html, define } from 'typed-dom';

const { origin } = location;
const log = new WeakSet<Element>();

export const attributes = {
  nofollow: [void 0],
} as const;
void ObjectSetPrototypeOf(attributes, null);

export const link: LinkParser = lazy(() => creator(bind(fmap(
  guard(context => context.syntax?.inline?.link ?? true,
  tails([
    dup(union([
      surround('[', media, ']'),
      surround('[', shortmedia, ']'),
      surround(
        '[',
        update({ syntax: { inline: {
          link: false,
          media: false,
          annotation: false,
          reference: false,
          extension: false,
          autolink: false,
        }}},
        startTight(some(inline, /^\\?\n|^]/))),
        backtracker(char(']')),
        false),
    ])),
    // TODO: Count this backtracking.
    dup(surround(/^{(?![{}])/, inits([uri, some(attribute)]), backtracker(str(/^ ?}/)))),
  ])),
  nss => nss.length === 1 ? [[], nss[0]] : nss),
  ([content, param]: [(HTMLElement | Text)[], Text[]], rest, _, context) => {
    assert(param.every(n => n instanceof Text));
    switch (true) {
      case content.length === 0:
        break;
      case content.length === 1
        && content[0].nodeName === 'A'
        && (content[0] as HTMLElement).firstElementChild?.classList.contains('media')
        && !log.has((content[0] as HTMLElement).firstElementChild!):
        content[0] = (content[0] as HTMLElement).firstElementChild as HTMLElement;
        assert(!log.has(content[0]));
        log.add(content[0]);
        assert(content[0].matches('.media'));
        break;
      case !context.insecure
        && !!frag(eval(some(autolink)(stringify(content), { ...context, insecure: true }))).firstElementChild:
        return;
    }
    assert(!frag(content).querySelector('a, .media, .annotation, .reference') || (content[0] as HTMLElement).matches('.media'));
    const [INSECURE_URL, ...params]: string[] = param.map(t => t.data);
    assert(INSECURE_URL === INSECURE_URL.trim());
    const el = defrag(html('a',
      {
        href: INSECURE_URL,
        rel: `noopener${params.includes(' nofollow') ? ' nofollow noreferrer' : ''}`,
      },
      content.length > 0
        ? content = content
        : decode(INSECURE_URL || '.')
            .replace(/^tel:/, '')
            .replace(/^h(?=ttps?:\/\/[^/?#\s])/, params.includes(' nofollow') ? '' : 'h')));
    if (!verify(el, INSECURE_URL)) return [[el], rest];
    void define(el, ObjectAssign(
      makeAttrs(attributes, params, [...el.classList], 'link'),
      { nofollow: void 0 }));
    return [[el], rest];
  })));

export const uri: LinkParser.ParamParser.UriParser = creator(match(
  /^ ?(?! )/,
  memoize(([delim]) => delim,
  delim => union([str(delim ? /^\S+/ : /^[^\s{}]+/)]))));

export const attribute: LinkParser.ParamParser.AttributeParser = creator(union([
  str(/^ [a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\n"])*")?(?=[ }])/),
]));

function verify(el: HTMLAnchorElement, url: string): boolean {
  let message: string;
  switch (el.protocol) {
    case 'tel:':
      if (`tel:${el.innerHTML.replace(/-(?=[0-9])/g, '')}` === url) return true;
      void define(el, {
        class: 'invalid',
        'data-invalid-syntax': 'link',
        'data-invalid-message': 'Invalid protocol',
      });
      message = 'Invalid phone number';
      break;
    case 'http:':
    case 'https:': {
      const { host } = el;
      host && el.origin !== origin && void el.setAttribute('target', '_blank');
      if (host) return true;
      message = 'Invalid host';
      break;
    }
    default:
      message = 'Invalid protocol';
  }
  void define(el, {
    class: 'invalid',
    'data-invalid-syntax': 'link',
    'data-invalid-message': message,
    href: null,
    rel: null,
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
