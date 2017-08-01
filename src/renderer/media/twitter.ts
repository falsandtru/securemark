﻿import DOM from 'typed-dom';
import { parse } from '../parser';

export function twitter(url: string): HTMLElement | void {
  if (!url.startsWith('https://twitter.com/')) return;
  return DOM.div({
    class: 'media',
    style: 'position: relative;',
  }, [DOM.em(`loading ${url}`)], () => {
    const outer = document.createElement('div');
    void $.ajax(`https://publish.twitter.com/oembed?url=${url.replace(/\?/, '&')}`, {
      dataType: 'jsonp',
      timeout: 10 * 1e3,
      success({ html }) {
        outer.innerHTML = `<div style="margin-top: -10px; margin-bottom: -10px;">${html}</div>`;
        $.ajax(outer.querySelector('script')!.src, {
          dataType: 'script',
          cache: true,
          timeout: 10 * 1e3,
        });
      },
      error({ statusText }) {
        outer.innerHTML = parse(`*${url}\\\n-> ${statusText}*`).querySelector('p')!.innerHTML;
      },
    });
    return outer;
  }).element;
}
