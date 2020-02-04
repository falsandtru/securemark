import { Array, location, encodeURI, decodeURI } from 'spica/global';
import { ObjectSetPrototypeOf } from 'spica/alias';
import { LinkParser, media, shortmedia, inline } from '../inline';
import { union, inits, tails, some, subline, validate, verify, surround, match, memoize, guard, configure, lazy, fmap, bind, eval } from '../../combinator';
import { unescsource } from '../source';
import { attribute, attrs as attrs_ } from './html';
import { autolink } from '../autolink';
import { defrag, dup, trimNodeEnd, hasTightText } from '../util';
import { concat } from 'spica/concat';
import { DeepImmutable } from 'spica/type';
import { frag, html, text, define } from 'typed-dom';

const { origin } = location;

export const attributes = {
  nofollow: [void 0],
} as const;
void ObjectSetPrototypeOf(attributes, null);

export const link: LinkParser = lazy(() => subline(bind(verify(fmap(validate(
  /^(?:\[.*?\])?{(?![{}]).+?}/,
  guard(config => config.syntax?.inline?.link ?? true,
  configure({ syntax: { inline: { link: false, annotation: false, reference: false, extension: false } } },
  tails([
    dup(union([
      surround('[', media, ']'),
      surround('[', shortmedia, ']'),
      surround('[', configure({ syntax: { inline: { media: false } } }, trimNodeEnd(defrag(some(inline, /^\\?\n|^]/)))), ']', false),
    ])),
    dup(surround(/^{(?![{}])/, inits([uri, some(defrag(attribute))]), /^ ?}/)),
  ])))),
  ns => concat([...Array(2 - ns.length)].map(() => []), ns)),
  ([text], _, config) => {
    if (text.length === 0) return true;
    if (text.length === 1 && text[0] instanceof HTMLAnchorElement && text[0].firstElementChild?.classList.contains('media')) {
      text[0] = text[0].firstElementChild as HTMLElement;
      assert(text[0].matches('.media'));
    }
    else {
      const proxy = html('div', text);
      assert(!proxy.querySelector('.media'));
      if (!hasTightText(proxy)) return false;
      if (config.insecure) {
        let isChanged = false;
        for (const el of proxy.querySelectorAll('a')) {
          void el.parentNode!.replaceChild(frag(el.childNodes), el);
          isChanged = true;
        }
        if (isChanged) {
          void text.splice(0, text.length, ...proxy.childNodes as NodeListOf<typeof text[number]>);
        }
      }
      else {
        if (eval(some(autolink)(proxy.textContent!, { insecure: true })).some(node => node.nodeType === 1)) return false;
      }
      assert(!proxy.querySelector('a, .annotation, .reference'));
    }
    return true;
  }),
  ([text, param]: [(HTMLElement | Text)[], Text[]], rest) => {
    const [INSECURE_URL, ...params]: string[] = param.map(({ data }) => data);
    assert(INSECURE_URL === INSECURE_URL.trim());
    const el = html('a',
      {
        href: INSECURE_URL,
        rel: `noopener${params.includes('nofollow') ? ' nofollow noreferrer' : ''}`,
      },
      text.length > 0
        ? text
        : decode(INSECURE_URL || '.')
            .replace(/^tel:/, '')
            .replace(/^h(?=ttps?:\/\/[^/?#\s])/, params.includes('nofollow') ? '' : 'h'));
    switch (el.protocol) {
      case 'tel:':
        if (`tel:${el.innerHTML.replace(/-(?=[0-9])/g, '')}` !== INSECURE_URL) return;
        break;
      case 'http:':
      case 'https:':
        if (!el.host) return;
        el.origin !== origin && void el.setAttribute('target', '_blank');
        break;
      default:
        return;
    }
    return [[define(el, attrs(attributes, params, [...el.classList], 'link'))], rest];
  })));

export const uri: LinkParser.ParamParser.UriParser = subline(defrag(match(
  /^ ?(?! )/,
  memoize(([flag]) => flag,
  flag =>
    some(union([bracket, unescsource]), flag === ' ' ? /^\s/ : /^[\s}]/)))));

export const bracket: LinkParser.ParamParser.UriParser.BracketParser = lazy(() => subline(union([
  fmap(
    surround('(', some(union([bracket, unescsource]), /^[\s\)]/), ')', false),
    ts => [text('('), ...ts, text(')')]),
  fmap(
    surround('[', some(union([bracket, unescsource]), /^[\s\]]/), ']', false),
    ts => [text('['), ...ts, text(']')]),
  fmap(
    surround('{', some(union([bracket, unescsource]), /^[\s\}]/), '}', false),
    ts => [text('{'), ...ts, text('}')]),
  fmap(
    surround('<', some(union([bracket, unescsource]), /^[\s\>]/), '>', false),
    ts => [text('<'), ...ts, text('>')]),
  fmap(
    surround('"', some(union([bracket, unescsource]), /^[\s\"]/), '"', false),
    ts => [text('"'), ...ts, text('"')]),
])));

export function attrs(
  spec: DeepImmutable<Record<string, Array<string | undefined>>> | undefined,
  params: string[],
  classes: string[],
  syntax: string,
): Record<string, string | undefined> {
  const attrs = attrs_(spec, params, classes, syntax);
  attrs['nofollow'] = void 0;
  return attrs;
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
