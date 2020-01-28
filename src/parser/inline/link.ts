import { Array, location } from 'spica/global';
import { LinkParser, media, shortmedia, inline } from '../inline';
import { union, inits, tails, some, subline, validate, verify, surround, match, memoize, guard, configure, lazy, fmap, bind, eval } from '../../combinator';
import { unescsource } from '../source';
import { attribute, attrs as attrs_ } from './html';
import { autolink } from '../autolink';
import { defrag, dup, trimNodeEnd, hasTightText } from '../util';
import { sanitize, decode } from '../string/uri';
import { concat } from 'spica/concat';
import { DeepImmutable } from 'spica/type';
import { frag, html, text, define } from 'typed-dom';

export const attributes = {
  nofollow: [void 0],
} as const;

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
          void text.splice(0, Infinity, ...proxy.childNodes as NodeListOf<typeof text[number]>);
        }
      }
      else {
        if (eval(some(autolink)(proxy.textContent!, { insecure: true })).some(node => node instanceof HTMLElement)) return false;
      }
      assert(!proxy.querySelector('a, .annotation, .reference'));
    }
    return true;
  }),
  ([text, param]: [(HTMLElement | Text)[], Text[]], rest) => {
    const [INSECURE_URL, ...params]: string[] = param.map(t => t.textContent!);
    const path = sanitize(INSECURE_URL, ['tel:']);
    if (path === void 0) return;
    const el = html('a',
      {
        href: path,
        rel: `noopener${params.includes('nofollow') ? ' nofollow noreferrer' : ''}`,
      },
      text.length > 0
        ? text
        : (sanitize(decode(INSECURE_URL || '.'), ['tel:']) || '')
            .replace(/^tel:/, '')
            .replace(/^h(?=ttps?:\/\/[^/?#\s])/, params.includes('nofollow') ? '' : 'h'));
    switch (el.protocol) {
      case 'tel:':
        if (el.getAttribute('href') !== `tel:${el.innerHTML.replace(/-(?=[0-9])/g, '')}`) return;
        break;
      default:
        if (el.origin === location.origin) break;
        void el.setAttribute('target', '_blank');
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
  for (const name of ['nofollow']) {
    attrs[name] = void 0;
  }
  return attrs;
}
