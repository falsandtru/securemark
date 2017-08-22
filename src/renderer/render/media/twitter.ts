import DOM from 'typed-dom';
import { parse } from '../../parser';
import { Cache } from 'spica/cache';
import { sanitize } from 'dompurify';

declare global {
  interface Window {
    twttr: any;
  }
}

let widgetScriptRequested = false;
const cache = new Cache<string, HTMLElement>(100);

export function twitter(url: string): HTMLElement | void {
  if (!url.startsWith('https://twitter.com/')) return;
  if (cache.has(url)) {
    const el = cache.get(url)!.cloneNode(true) as HTMLElement;
    window.twttr && void window.twttr.widgets.load(el);
    return el;
  }
  return DOM.div({
    class: 'media',
    style: 'position: relative;',
  }, [DOM.em(`loading ${url}`)], () => {
    const outer = document.createElement('div');
    void $.ajax(`https://publish.twitter.com/oembed?url=${url.replace('?', '&')}`, {
      dataType: 'jsonp',
      timeout: 10 * 1e3,
      success({ html }): void {
        outer.innerHTML = sanitize(`<div style="margin-top: -10px; margin-bottom: -10px;">${html}</div>`, { ADD_TAGS: ['script'] });
        void cache.set(url, outer.cloneNode(true) as HTMLElement);
        if (widgetScriptRequested) return;
        if (window.twttr) return void window.twttr.widgets.load(outer);
        widgetScriptRequested = true;
        const script = outer.querySelector('script')!.cloneNode(true) as HTMLScriptElement;
        if (!script.getAttribute('src')!.startsWith('//platform.twitter.com/')) return;
        script.async = true;
        void document.head.appendChild(script);
      },
      error({ statusText }) {
        outer.innerHTML = parse(`*${url}\\\n-> ${statusText}*`).querySelector('p')!.innerHTML;
      },
    });
    return outer;
  }).element;
}
