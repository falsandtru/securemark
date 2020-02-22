import { location, encodeURI, decodeURI } from 'spica/global';
import { ObjectAssign, ObjectSetPrototypeOf } from 'spica/alias';
import { MarkdownParser } from '../../../markdown';
import { LinkParser, inline, media, shortmedia } from '../inline';
import { union, inits, tails, some, subline, creator, surround, match, memoize, guard, context, lazy, fmap, bind, eval } from '../../combinator';
import { startTight, isTight, trimEnd, dup, defrag, stringify } from '../util';
import { str } from '../source';
import { makeAttrs } from './html';
import { autolink } from '../autolink';
import { frag, html, define } from 'typed-dom';
import { DeepMutable } from 'spica/type';

const { origin } = location;
const log = new WeakSet<Element>();

export const attributes = {
  nofollow: [void 0],
} as const;
void ObjectSetPrototypeOf(attributes, null);

export const link: LinkParser = lazy(() => subline(creator(bind(fmap(
  guard(context => context.syntax?.inline?.link ?? true,
  tails([
    dup(union([
      surround('[', media, ']'),
      surround('[', shortmedia, ']'),
      surround(
        '[',
        context({ syntax: { inline: {
          link: false,
          media: false,
          annotation: false,
          reference: false,
          extension: false,
          autolink: false,
        }}},
        startTight(some(inline, /^\\?\n|^]/))),
        ']',
        true),
    ])),
    dup(surround(/^{(?![{}])/, inits([uri, some(attribute)]), /^ ?}/)),
  ])),
  nss => nss.length === 1 ? [[], nss[0]] : nss),
  ([content, param]: [(HTMLElement | Text)[], Text[]], rest, context: DeepMutable<MarkdownParser.Context>) => {
    assert(param.every(n => n instanceof Text));
    if (!isTight(content, 0, content.length)) return;
    switch (true) {
      case content.length === 0:
        break;
      case content.length === 1
        && 'id' in content[0]
        && content[0].tagName === 'A'
        && content[0].firstElementChild?.classList.contains('media')
        && !log.has(content[0].firstElementChild!):
        content[0] = (content[0] as HTMLElement).firstElementChild as HTMLElement;
        assert(!log.has(content[0]));
        log.add(content[0]);
        assert(content[0].matches('.media'));
        break;
      case !context.insecure
        && !!eval(some(autolink)(stringify(content), { ...context, insecure: true })).some(node => 'id' in node):
        return;
    }
    assert(!frag(content).querySelector('a, .media, .annotation, .reference') || (content[0] as HTMLElement).matches('.media'));
    const [INSECURE_URI, ...params]: string[] = param.map(t => t.data);
    assert(INSECURE_URI === INSECURE_URI.trim());
    const el = defrag(html('a',
      {
        href: INSECURE_URI,
        rel: `noopener${params.includes(' nofollow') ? ' nofollow noreferrer' : ''}`,
      },
      content.length > 0
        ? content = trimEnd(content)
        : decode(INSECURE_URI || '.')
            .replace(/^h(?=ttps?:\/\/[^/?#\s])/, params.includes(' nofollow') ? '' : 'h')
            .replace(/^tel:/, '')));
    if (!verify(el, INSECURE_URI)) return [[el], rest];
    void define(el, ObjectAssign(
      makeAttrs(attributes, params, [...el.classList], 'link'),
      { nofollow: void 0 }));
    return [[el], rest];
  }))));

export const uri: LinkParser.ParamParser.UriParser = creator(match(
  /^ ?(?! )/,
  memoize(([delim]) => delim,
  delim => union([str(delim ? /^\S+/ : /^[^\s{}]+/)]))));

export const attribute: LinkParser.ParamParser.AttributeParser = creator(union([
  str(/^ [a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\n"])*")?(?=[ }])/),
]));

function verify(el: HTMLAnchorElement, uri: string): boolean {
  let message: string;
  switch (el.protocol) {
    case 'http:':
    case 'https:': {
      const { host } = el;
      host && el.origin !== origin && void el.setAttribute('target', '_blank');
      if (host) return true;
      message = 'Invalid host';
      break;
    }
    case 'tel:':
      if (`tel:${el.textContent!.replace(/-(?=[0-9])/g, '')}` === uri) return true;
      message = 'Invalid phone number';
      break;
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
