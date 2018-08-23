import { LinkParser, inline } from '../inline';
import { union, inits, sequence, some, fmap, bind, match, surround, subline, focus, verify, build } from '../../combinator';
import { unescsource } from '../source/unescapable';
import { compress, startsWithTightText, hasContent, hasMedia, hasLink } from '../util';
import { sanitize, decode } from '../string/uri';
import { html, text, frag } from 'typed-dom';

const attributes: Record<string, Array<string | undefined>> = {
  nofollow: [undefined],
};

export const link: LinkParser = subline(bind(build(() =>
  sequence<LinkParser>([
    subline(verify(
      fmap(
        surround('[', compress(some(union([inline]), ']')), /^\](?=\(( ?)[^\n]*?\1\))/, false),
        ns => [frag(ns)]),
      ([text]) => {
        if (hasMedia(text)) {
          void text.querySelectorAll('a > .media')
            .forEach(el =>
              void el.parentNode!.parentNode!.replaceChild(el, el.parentNode!))
          if (text.childNodes.length !== 1) return false;
          if (!text.firstElementChild!.matches('.media')) return false;
        }
        else {
          if (text.childNodes.length > 0 && !startsWithTightText(text)) return false;
          if (hasLink(text)) return false;
        }
        assert(!hasLink(text) || text.firstElementChild!.matches('.media'));
        return true;
      })),
    subline(fmap(
      surround(
        '(',
        inits<LinkParser.ParamParser>([
          uri,
          some(compress(attribute)),
        ]),
        /^ ?\)/,
        false),
      ts => [frag(ts)])),
  ])),
  ([text, param], rest) => {
    const [INSECURE_URL = '', ...args]: string[] = [...param.childNodes].map(t => t.textContent!);
    const path = sanitize(INSECURE_URL);
    if (path === '' && INSECURE_URL !== '') return;
    const attrs: Map<string, string | undefined> = new Map(args.map<[string, string | undefined]>(
      arg => [arg.split('=', 1)[0], arg.includes('=') ? arg.slice(arg.split('=', 1)[0].length + 1) : undefined]));
    const el = html('a',
      {
        href: path,
        rel: `noopener ${attrs.has('nofollow') ? 'nofollow noreferrer' : ''}`.trim(),
      },
      hasContent(text)
        ? text.childNodes
        : sanitize(decode(INSECURE_URL || '.'))
            .replace(/^tel:/, '')
            .replace(/^h(?=ttps?:\/\/)/, attrs.has('nofollow') ? '' : 'h'));
    assert(hasContent(el));
    if (el.textContent!.trim().match(/^[#@]/)) return;
    if (el.protocol === 'tel:' && el.getAttribute('href') !== `tel:${el.innerHTML.replace(/-(?=[0-9])/g, '')}`) return;
    if ((el.origin !== window.location.origin || hasMedia(el)) && el.protocol !== 'tel:') {
      void el.setAttribute('target', '_blank');
    }
    if (attrs.size !== args.length) {
      void el.classList.add('invalid');
    }
    for (const [key, value] of attrs.entries()) {
      if (attributes.hasOwnProperty(key) && attributes[key].includes(value)) continue;
      void el.classList.add('invalid');
    }
    return [[el], rest];
  }));

export const uri: LinkParser.ParamParser.UriParser = subline(match(
  /^ ?(?! )/,
  ([flag], rest) =>
    compress(some(
      union<LinkParser.ParamParser.UriParser>([bracket, unescsource]),
      flag === ' ' ? /^\s/ : /^\s|^\)/))
      (rest)));

export const bracket: LinkParser.ParamParser.UriParser.BracketParser = subline(build(() => union([
  fmap(
    surround('(', some(union([bracket, unescsource]), /^[\)\s]/), ')', false),
    ts => [text('('), ...ts, text(')')]),
  fmap(
    surround('[', some(union([bracket, unescsource]), /^[\]\s]/), ']', false),
    ts => [text('['), ...ts, text(']')]),
  fmap(
    surround('{', some(union([bracket, unescsource]), /^[\}\s]/), '}', false),
    ts => [text('{'), ...ts, text('}')]),
  fmap(
    surround('<', some(union([bracket, unescsource]), /^[\>\s]/), '>', false),
    ts => [text('<'), ...ts, text('>')]),
  fmap(
    surround('"', some(union([bracket, unescsource]), /^[\"\s]/), '"', false),
    ts => [text('"'), ...ts, text('"')]),
])));

export const attribute: LinkParser.ParamParser.AttributeParser = subline(
  surround(
    ' ',
    focus(/^[a-z]+(?:=[^\s)]+)?/, some(union([unescsource]))),
    ''));
