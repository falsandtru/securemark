import { LinkParser, inline } from '../inline';
import { Parser, union, subsequence, some, capture, surround, transform, build } from '../../combinator';
import { SubParser } from '../../combinator/parser';
import { line } from '../source/line';
import { text } from '../source/text';
import { escsource } from '../source/escapable';
import { compress, hasText, hasContent, hasMedia, hasLink, hasAnnotation, stringify } from '../util';
import { sanitize } from '../string/url';
import { html, text as txt, frag } from 'typed-dom';

export const link: LinkParser = line(transform(build(() =>
  line(surround('[', compress(some(union([inline]), ']')), ']', false), false)),
  (ns, rest) => {
    const children = frag(ns);
    if (hasAnnotation(children)) return;
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
    return transform(
      line(surround('(', subsequence<SubParser<LinkParser>>([some(union<Parser<Text, [typeof parenthesis, typeof text]>>([parenthesis, text]), /^\)|^\s/), attribute]), ')', false), false),
      (ns, rest) => {
        const [, INSECURE_URL = '', attr = ''] = stringify(ns).match(/^(.*?)(?:\n(.*))?$/) || [];
        assert(attr === '' || attr === 'nofollow');
        const url = sanitize(INSECURE_URL);
        if (url === '' && INSECURE_URL !== '') return;
        const el = html('a',
          {
            href: url,
            rel: attr === 'nofollow' ? 'noopener nofollow noreferrer' : 'noopener',
          },
          hasContent(children)
            ? children.childNodes
            : sanitize(INSECURE_URL || window.location.href)
                .replace(/^h(?=ttps?:\/\/)/, attr === 'nofollow' ? '' : 'h'));
        assert(hasContent(el));
        if (window.location.origin !== el.origin || hasMedia(el)) {
          void el.setAttribute('target', '_blank');
        }
        return [[el], rest];
      })
      (rest);
  }
), false);

export const parenthesis: LinkParser.ParenthesisParser = transform(build(() =>
  surround('(', some(union([parenthesis, escsource]), /^\)|^\s/), ')', false)),
  (ts, rest) =>
    [[txt('('), ...ts, txt(')')], rest]);

const attribute: LinkParser.AttributeParser =
  surround(
    /^\s(?=\S)/,
    capture(/^nofollow/, ([attr], rest) =>
      [[txt(`\n${attr}`)], rest]),
    /^(?=\))/);
