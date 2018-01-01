import DOM from 'typed-dom';
import { parse } from '../../../parser/parse';
import { escape } from '../../../parser/escape';
import { sanitize } from 'dompurify';
import { Cache } from 'spica/cache';

declare global {
  interface Window {
    twttr: any;
  }
}

let widgetScriptRequested = false;
const cache = new Cache<string, HTMLElement>(100);

export function twitter(url: string): HTMLElement {
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
      cache: true,
      success({ html }): void {
        outer.innerHTML = sanitize(`<div style="margin-top: -10px; margin-bottom: -10px;">${html}</div>`, { ADD_TAGS: ['script'] });
        void cache.set(url, outer.cloneNode(true) as HTMLElement);
        if (window.twttr) return void window.twttr.widgets.load(outer);
        if (widgetScriptRequested) return;
        widgetScriptRequested = true;
        const script = outer.querySelector('script')!;
        if (!script.getAttribute('src')!.startsWith('https://platform.twitter.com/')) return;
        void $.ajax(script.src, {
          dataType: 'script',
          cache: true,
        });
      },
      error({ status, statusText }) {
        assert(Number.isSafeInteger(status));
        outer.innerHTML = parse(`*${escape(url)}\\\n-> ${status}: ${escape(statusText)}*`).querySelector('p')!.innerHTML;
      },
    });
    return outer;
  }).element;
}
