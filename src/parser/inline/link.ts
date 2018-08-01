import { LinkParser, inline } from '../inline';
import { Parser, union, subsequence, some, match, surround, fmap, bind, build } from '../../combinator';
import { line } from '../source/line';
import { unescsource } from '../source/unescapable';
import { compress, hasText, hasContent, hasMedia, hasLink, hasAnnotationOrAuthority, stringify } from '../util';
import { sanitize, decode } from '../string/uri';
import { html, text, frag } from 'typed-dom';

export const link: LinkParser = line(bind(build(() =>
  line(surround('[', compress(some(union([inline]), ']')), ']', false), false)),
  (ns, rest) => {
    const children = frag(ns);
    if (hasAnnotationOrAuthority(children)) return;
    if (hasMedia(children)) {
      void children.querySelectorAll('a > .media')
        .forEach(el =>
          void el.parentNode!.parentNode!.replaceChild(el, el.parentNode!))
      if (children.childNodes.length !== 1) return;
      if (!children.firstElementChild!.matches('.media')) return;
      assert(!hasLink(children));
    }
    else {
      if (children.childNodes.length > 0 && !hasText(children)) return;
      if (hasLink(children)) return;
    }
    assert(children.querySelector('a > .media') || !hasLink(children));
    const [{ length: count }] = rest.match(/^\(+/) || ['('];
    return bind(
      line(surround(
        '('.repeat(count),
        subsequence<LinkParser>([
          some(union<Parser<Text, [typeof bracket, typeof unescsource]>>([bracket, unescsource]), new RegExp(`^\\){${count}}|^ (?!\\))|^[^\\S ]`)),
          attribute
        ]),
        ')'.repeat(count),
        false
      ), false),
      (ns, rest) => {
        const [, INSECURE_URL = '', attr = ''] = stringify(ns).match(/^(\S*)[^\S\n]*(?:\n(.*))?$/) || [];
        assert(attr === '' || attr === 'nofollow');
        const uri = sanitize(INSECURE_URL);
        if (uri === '' && INSECURE_URL !== '') return;
        const el = html('a',
          {
            href: uri,
            rel: attr === 'nofollow' ? 'noopener nofollow noreferrer' : 'noopener',
          },
          hasContent(children)
            ? children.childNodes
            : sanitize(decode(INSECURE_URL || '.'))
                .replace(/^tel:/, '')
                .replace(/^h(?=ttps?:\/\/)/, attr === 'nofollow' ? '' : 'h'));
        assert(hasContent(el));
        if (el.protocol === 'tel:' && el.getAttribute('href') !== `tel:${el.innerHTML.replace(/-(?=\d)/g, '')}`) return;
        if ((window.location.origin !== el.origin || hasMedia(el)) && el.protocol !== 'tel:') {
          void el.setAttribute('target', '_blank');
        }
        if (el.textContent!.trim().match(/^[#@]/)) return;
        return [[el], rest];
      })
      (rest);
  }
), false);

export const ipv6 = fmap(
  surround('[', match(/^[:0-9a-z]+/, ([addr], rest) => [[text(addr)], rest]), ']'),
  ts => [text('['), ...ts, text(']')]);

export const bracket: LinkParser.BracketParser = build(() => union([
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
]));

const attribute: LinkParser.AttributeParser =
  surround(
    /^ (?=\S)/,
    match(/^nofollow/, ([attr], rest) =>
      [[text(`\n${attr}`)], rest]),
    /^(?=\))/);
