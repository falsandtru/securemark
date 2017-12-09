﻿import DOM from 'typed-dom';
import { parse, escape } from '../../parser';
import { sanitize } from 'dompurify';
import { cache } from '../../../parser/inline/media';

export function gist(url: string): HTMLElement {
  if (cache.has(url)) return cache.get(url)!.cloneNode(true) as HTMLElement;
  return DOM.div({
    class: 'media',
    style: 'position: relative;',
  }, [DOM.em(`loading ${url}`)], () => {
    const outer = document.createElement('div');
    void $.ajax(`${url}.json`, {
      dataType: 'jsonp',
      timeout: 10 * 1e3,
      cache: true,
      success({ div, stylesheet, description }) {
        if (!stylesheet.startsWith('https://assets-cdn.github.com/')) return;
        outer.innerHTML = sanitize(`<div style="position: relative; margin-bottom: -1em;">${div}</div>`);
        const gist = outer.querySelector('.gist')! as HTMLElement;
        void gist.insertBefore(
          DOM.div({ class: 'gist-description' }, [
            DOM.a({ style: 'text-decoration: none; color: #555; font-size: 14px; font-weight: 600;' }, description, () =>
              parse(escape(url)).querySelector('a')!),
          ]).element,
          gist.firstChild);
        void cache.set(url, outer.cloneNode(true) as HTMLElement);
        if (document.head.querySelector(`link[rel="stylesheet"][href="${stylesheet}"]`)) return;
        void document.head.appendChild(DOM.link({
          rel: 'stylesheet',
          href: stylesheet,
          crossorigin: 'anonymous',
        }).element);
      },
      error({ status, statusText }) {
        assert(Number.isSafeInteger(status));
        outer.innerHTML = parse(`*${escape(url)}\\\n-> ${status}: ${escape(statusText)}*`).querySelector('p')!.innerHTML;
      },
    });
    return outer;
  }).element;
}
