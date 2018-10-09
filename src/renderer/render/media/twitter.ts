import { parse } from '../../../parser';
import { Cache } from 'spica/cache';
import { Cancellation } from 'spica/cancellation';
import { sanitize } from 'dompurify';
import DOM, { html, define } from 'typed-dom';

declare global {
  interface Window {
    twttr?: {
      ready: (f: () => void) => any;
      widgets: {
        load: (el: HTMLElement) => void;
      };
    };
  }
}

const origins = new Set([
  'https://twitter.com',
]);
const cache = new Cache<string, HTMLElement>(10);

const jobs = new Cancellation();

window.twttr
  ? void window.twttr.ready(() => void setTimeout(jobs.cancel, 1000)) // Wait a moment to avoid a bug of twitter widget.
  : void document.body.appendChild(html('script', {
      id: 'twitter-wjs',
      src: 'https://platform.twitter.com/widgets.js',
      onload: () => void setTimeout(jobs.cancel, 1000), // Wait a moment to avoid a bug of twitter widget.
    }));

export function twitter(url: URL): HTMLElement | undefined {
  if (!origins.has(url.origin)) return;
  if (!url.pathname.match(/^\/\w+\/status\/[0-9]{15,}(?!\w)/)) return;
  if (cache.has(url.href)) {
    const el = cache.get(url.href)!.cloneNode(true);
    void jobs.register(() => void window.twttr!.widgets.load(el));
    return el;
  }
  return DOM.div({ style: 'position: relative;' }, [DOM.em(`loading ${url.href}`)], (f, tag) => {
    const outer = f(tag);
    void $.ajax(`https://publish.twitter.com/oembed?url=${url.href.replace('?', '&')}&omit_script=true`, {
      dataType: 'jsonp',
      timeout: 10 * 1e3,
      cache: true,
      success({ html }): void {
        outer.innerHTML = sanitize(`<div style="margin-top: -10px; margin-bottom: -10px;">${html}</div>`);
        void cache.set(url.href, outer.cloneNode(true));
        void jobs.register(() => void window.twttr!.widgets.load(outer));
      },
      error({ status, statusText }) {
        assert(Number.isSafeInteger(status));
        void define(outer, [parse(`*[]( ${url.href} )*\n\n\`\`\`\n${status}\n${statusText}\n\`\`\``)]);
      },
    });
    return outer;
  }).element;
}
