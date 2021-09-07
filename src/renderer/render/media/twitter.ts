import { window, document } from 'spica/global';
import { parse } from '../../../parser';
import { HTML, define } from 'typed-dom';
import { sanitize } from 'dompurify';

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (el: HTMLElement) => void;
      };
    };
  }
}

const origins = [
  'https://twitter.com',
];

export function twitter(source: HTMLImageElement, url: URL): HTMLElement | undefined {
  if (!origins.includes(url.origin)) return;
  if (url.pathname.split('/').pop()!.includes('.')) return;
  if (!url.pathname.match(/^\/\w+\/status\/[0-9]{15,}(?!\w)/)) return;
  return HTML.div({ class: source.className }, [HTML.em(`loading ${source.getAttribute('data-src')}`)], (h, tag) => {
    const outer = h(tag);
    $.ajax(`https://publish.twitter.com/oembed?url=${url.href.replace('?', '&')}&omit_script=true`, {
      dataType: 'jsonp',
      timeout: 10 * 1e3,
      cache: true,
      success({ html }): void {
        outer.innerHTML = sanitize(`<div style="margin-top: -10px; margin-bottom: -10px;">${html}</div>`);
        if (window.twttr) return void window.twttr.widgets.load(outer);
        const id = 'twitter-wjs';
        if (document.getElementById(id)) return;
        document.body.appendChild(h('script', { id, src: 'https://platform.twitter.com/widgets.js' }));
      },
      error({ status, statusText }) {
        assert(Number.isSafeInteger(status));
        define(outer, [parse(`*{ ${source.getAttribute('data-src')} }*\n\n\`\`\`\n${status}\n${statusText}\n\`\`\``)]);
      },
    });
    return outer;
  }).element;
}
