import { window, document } from 'spica/global';
import { parse } from '../../../parser';
import { html, define } from 'typed-dom/dom';
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
  const el = html('div', { class: source.className, 'data-type': 'twitter' }, [
    html('em', `Loading ${source.getAttribute('data-src')}...`),
  ]);
  $.ajax(`https://publish.twitter.com/oembed?url=${url.href.replace('?', '&')}&omit_script=true`, {
    dataType: 'jsonp',
    timeout: 10 * 1e3,
    cache: true,
    success({ html }): void {
      el.innerHTML = sanitize(html);
      if (window.twttr) return void window.twttr.widgets.load(el);
      const id = 'twitter-wjs';
      if (document.getElementById(id)) return;
      document.body.appendChild(html('script', { id, src: 'https://platform.twitter.com/widgets.js' }));
    },
    error({ status, statusText }) {
      assert(Number.isSafeInteger(status));
      define(el, [parse(`*{ ${source.getAttribute('data-src')} }*\n\n\`\`\`\n${status}\n${statusText}\n\`\`\``)]);
    },
  });
  return el;
}
