import { LinkParser, inline } from '../inline';
import { combine, loop, bracket, transform } from '../../combinator';
import { escsource } from '../source/escapable';
import { parenthesis } from '../source/parenthesis';
import { squash } from '../squash';
import { match, isSingleLine } from '../source/validation';
import { sanitize } from '../string/url';
import { html } from 'typed-dom';

const syntax = /^\[[^\n]*?\]\(/;

export const link: LinkParser = source => {
  if (!match(source, '[', syntax)) return;
  return transform(
    bracket(
      '[',
      loop(combine<LinkParser>([inline]), /^]\n?|^\n/),
      ']'),
    (ns, rest) => {
      if (!isSingleLine(source.slice(0, source.length - rest.length).trim())) return;
      const children = squash(ns, document.createDocumentFragment());
      if (children.querySelector('a, .annotation') && !children.querySelector('.media')) return;
      if (children.querySelector('img, .media')) {
        if (children.childNodes.length > 1 || !children.firstElementChild || !children.firstElementChild.matches('img, .media')) return;
      }
      else {
        if (children.childNodes.length > 0 && children.textContent!.trim() === '') return;
      }
      return transform(
        bracket(
          '(',
          loop(combine<LinkParser>([parenthesis, escsource]), /^\)|^\s(?!nofollow)|^\n/),
          ')'),
        (ns, rest) => {
          const [INSECURE_URL, attribute] = ns.reduce((s, c) => s + c.textContent, '').replace(/\\(.)/g, '$1').split(/\s/);
          assert(attribute === undefined || attribute === 'nofollow');
          const url = sanitize(INSECURE_URL);
          assert(url === url.trim());
          if (INSECURE_URL !== '' && url === '') return;
          const el = html('a', {
            href: url,
            rel: attribute === 'nofollow' ? 'noopener nofollow noreferrer' : 'noopener',
          });
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
        (rest);
    })
    (source);
};
