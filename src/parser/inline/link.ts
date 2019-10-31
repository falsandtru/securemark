import { LinkParser, media, shortmedia, inline } from '../inline';
import { union, inits, tails, some, subline, validate, verify, surround, match, lazy, override, fmap, bind } from '../../combinator';
import { unescsource } from '../source';
import { attribute, attrs as attrs_ } from './html';
import { defrag, wrap, trimNodeEnd, hasTightText, hasContent, hasLink, memoize } from '../util';
import { sanitize, decode } from '../string/uri';
import { concat } from 'spica/concat';
import { DeepImmutable } from 'spica/type';
import { html, text, frag, define } from 'typed-dom';

export const attributes: DeepImmutable<Record<string, Array<string | undefined>>> = {
  nofollow: [undefined],
};

export const link: LinkParser = lazy(() => subline(bind(verify(fmap(validate(
  /^(?:\[.*?\])?{.+?}/,
  validate(config => config?.syntax?.inline?.link ?? true,
  override({ syntax: { inline: { link: false } } },
  tails([
    wrap(trimNodeEnd(defrag(union([
      surround('[', media, ']'),
      surround('[', shortmedia, ']'),
      surround('[', override({ syntax: { inline: { media: false } } }, some(inline, /^\\?\n|^]/)), ']', false),
    ])))),
    wrap(surround('{', inits<LinkParser.ParamParser>([uri, some(defrag(attribute))]), /^ ?}/)),
  ])))),
  ns => concat([...Array(2 - ns.length)].map(() => frag()), ns)),
  ([text]) => {
    if (text.firstElementChild?.firstElementChild?.matches('a > .media')) {
      assert(text.childNodes.length === 1);
      void text.replaceChild(text.firstElementChild.firstElementChild, text.firstElementChild);
    }
    else {
      if (text.childNodes.length > 0 && !hasTightText(text)) return false;
      if (hasLink(text)) return false;
    }
    assert(!hasLink(text) || text.firstElementChild!.matches('.media'));
    return true;
  }),
  ([text, param], rest, config) => {
    const [INSECURE_URL, ...params]: string[] = [...param.childNodes].map(t => t.textContent!);
    const path = sanitize(INSECURE_URL);
    if (path === '' && INSECURE_URL !== '') return;
    const el = html('a',
      {
        href: path,
        rel: `noopener${params.includes('nofollow') ? ' nofollow noreferrer' : ''}`,
      },
      hasContent(text)
        ? text.childNodes
        : sanitize(decode(INSECURE_URL || '.'))
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
    return [[define(el, attrs(attributes, params, new Set(el.classList), 'link'))], rest, config];
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
  classes: Set<string>,
  syntax: string,
): Record<string, string | undefined> {
  const attrs = attrs_(spec, params, classes, syntax);
  for (const name of ['nofollow']) {
    attrs[name] = undefined;
  }
  return attrs;
}
