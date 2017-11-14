import { LinkParser, inline } from '../inline';
import { combine, loop, bracket, transform } from '../../combinator';
import { escsource } from '../source/escapable';
import { squash } from '../squash';
import { validate } from '../source/validation';
import { sanitize } from '../string/url';

const syntax = /^\[[^\n]*?\]\n?\(/;

export const link: LinkParser = (source: string) => {
  if (!validate(source, '[', syntax)) return;
  return transform(
    bracket(
      '[',
      loop(combine<HTMLElement | Text, LinkParser.InnerParsers>([inline]), /^]\n?|^\n/),
      /^]\n?/),
    (ns, rest) => {
      const children = squash(ns);
      if (children.querySelector('a, .annotation')) return;
      if (children.querySelector('img')) {
        if (children.childNodes.length > 1 || !children.firstElementChild || !children.firstElementChild.matches('img')) return;
      }
      else {
        if (children.childNodes.length > 0 && children.textContent!.trim() === '') return;
        if (children.textContent !== children.textContent!.trim()) return;
      }
      return transform(
        bracket(
          '(',
          loop(escsource, /^\)|^\s(?!nofollow)|^\n/),
          ')'),
        (ns, rest) => {
          const [INSECURE_URL, attribute] = ns.reduce((s, c) => s + c.textContent, '').replace(/\\(.)/g, '$1').split(/\s/);
          assert(attribute === undefined || attribute === 'nofollow');
          const url = sanitize(INSECURE_URL);
          assert(url === url.trim());
          if (INSECURE_URL !== '' && url === '') return;
          const el = document.createElement('a');
          void el.setAttribute('href', url);
          void el.setAttribute('rel', attribute === 'nofollow' ? 'noopener nofollow noreferrer' : 'noopener');
          if (location.protocol !== el.protocol || location.host !== el.host) {
            void el.setAttribute('target', '_blank');
          }
          void el.appendChild(
            children.textContent || children.querySelector('img')
              ? children
              : document.createTextNode((INSECURE_URL || el.href).replace(/^h(?=ttps?:\/\/)/, attribute === 'nofollow' ? '' : 'h')));
          assert(el.querySelector('img') || el.textContent!.trim());
          return [[el], rest];
        })
        (rest) as [[HTMLAnchorElement], string];
    })
    (source);
};
