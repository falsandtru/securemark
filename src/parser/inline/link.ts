import { LinkParser, media, shortmedia, inline } from '../inline';
import { union, inits, tails, some, subline, validate, verify, surround, match, memoize, guard, configure, lazy, fmap, bind } from '../../combinator';
import { unescsource } from '../source';
import { attribute, attrs as attrs_ } from './html';
import { defrag, dup, trimNodeEnd, hasTightText, hasContent } from '../util';
import { sanitize, decode } from '../string/uri';
import { concat } from 'spica/concat';
import { DeepImmutable } from 'spica/type';
import { html, text, define } from 'typed-dom';

export const attributes: DeepImmutable<Record<string, Array<string | undefined>>> = {
  nofollow: [undefined],
};

export const link: LinkParser = lazy(() => subline(bind(verify(fmap(validate(
  /^(?:\[.*?\])?{.+?}/,
  guard(config => config?.syntax?.inline?.link ?? true,
  configure({ syntax: { inline: { link: false } } },
  tails([
    dup(trimNodeEnd(defrag(union([
      surround('[', media, ']'),
      surround('[', shortmedia, ']'),
      surround('[', configure({ syntax: { inline: { media: false } } }, some(inline, /^\\?\n|^]/)), ']', false),
    ])))),
    dup(surround('{', inits([uri, some(defrag(attribute))]), /^ ?}/)),
  ])))),
  ns => concat([...Array(2 - ns.length)].map(() => []), ns)),
  ([text]) => {
    if (text.length === 0) return true;
    if (text.length === 1 && text[0] instanceof HTMLAnchorElement && text[0].firstElementChild?.classList.contains('media')) {
      text[0] = text[0].firstElementChild as HTMLElement;
    }
    else {
      const proxy = html('div', text);
      if (!hasTightText(proxy)) return false;
      if (proxy.getElementsByTagName('a').length > 0) return false;
    }
    assert(!html('div', text).querySelector('a') || html('div', text).firstElementChild!.matches('.media'));
    return true;
  }),
  ([text, param]: [(HTMLElement | Text)[], Text[]], rest) => {
    const [INSECURE_URL, ...params]: string[] = param.map(t => t.textContent!);
    const path = sanitize(INSECURE_URL, ['tel:']);
    if (path === undefined) return;
    const el = html('a',
      {
        href: path,
        rel: `noopener${params.includes('nofollow') ? ' nofollow noreferrer' : ''}`,
      },
      text.length > 0
        ? text
        : (sanitize(decode(INSECURE_URL || '.'), ['tel:']) || '')
            .replace(/^tel:/, '')
            .replace(/^h(?=ttps?:\/\/)/, params.includes('nofollow') ? '' : 'h'));
    assert(hasContent(el));
    switch (el.protocol) {
      case 'tel:':
        if (el.getAttribute('href') === `tel:${el.innerHTML.replace(/-(?=[0-9])/g, '')}`) break;
        return;
      default:
        if (el.origin === window.location.origin) break;
        void el.setAttribute('target', '_blank');
    }
    return [[define(el, attrs(attributes, params, el.className.trim().split(/\s+/), 'link'))], rest];
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
    attrs[name] = undefined;
  }
  return attrs;
}
