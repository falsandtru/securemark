import { LinkParser, inline } from '../inline';
import { union, inits, tails, some, subline, validate, verify, surround, match, lazy, fmap, bind } from '../../combinator';
import { unescsource } from '../source/unescapable';
import { attribute, attr } from './html';
import { defrag, wrap, trimNodeEnd, hasTightText, hasContent, hasMedia, hasLink } from '../util';
import { sanitize, decode } from '../string/uri';
import { concat } from 'spica/concat';
import { html, text, frag, define } from 'typed-dom';

export const attributes: Record<string, Array<string | undefined>> = {
  nofollow: [undefined],
};

export const link: LinkParser = lazy(() => subline(bind(verify(fmap(validate(
  /^(?:\[.*?\])?{.+?}/,
  tails<LinkParser>([
    wrap(surround('[', trimNodeEnd(defrag(some(union([inline]), /^[\n\]]/))), ']', false)),
    wrap(surround('{', inits([uri, some(defrag(attribute))]), /^ ?}/)),
  ])),
  ns => concat([...Array(2 - ns.length)].map(() => frag()), ns)),
  ([text]) => {
    if (hasMedia(text)) {
      if (text.firstChild && text.firstChild.firstChild &&
          text.firstChild.firstChild === text.querySelector('a > .media:last-child')) {
        void text.replaceChild(text.firstChild.firstChild, text.firstChild);
      }
      if (text.childNodes.length !== 1) return false;
      if (!text.firstElementChild!.matches('.media:last-child')) return false;
    }
    else {
      if (text.childNodes.length > 0 && !hasTightText(text)) return false;
      if (hasLink(text)) return false;
    }
    assert(!hasLink(text) || text.firstElementChild!.matches('.media'));
    return true;
  }),
  ([text, param], rest) => {
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
    if (el.textContent!.trim().match(/^[#@]/)) return;
    if (el.protocol === 'tel:' && el.getAttribute('href') !== `tel:${el.innerHTML.replace(/-(?=[0-9])/g, '')}`) return;
    if ((el.origin !== window.location.origin || hasMedia(el)) && el.protocol !== 'tel:') {
      void el.setAttribute('target', '_blank');
    }
    return [[define(el, attr(attributes, params, new Set(el.classList), 'link'))], rest];
  })));

export const uri: LinkParser.ParamParser.UriParser = subline(defrag(match(
  /^ ?(?! )/,
  ([flag]) => [flag],
  ([flag]) =>
    some(union([bracket, unescsource]), flag === ' ' ? /^\s/ : /^[\s}]/))));

export const bracket: LinkParser.ParamParser.UriParser.BracketParser = lazy(() => subline(union<LinkParser.ParamParser.UriParser.BracketParser>([
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
