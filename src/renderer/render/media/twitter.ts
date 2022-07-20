import { window, document } from 'spica/global';
import { parse } from '../../../parser';
import { html as h, define } from 'typed-dom/dom';
import DOMPurify from 'dompurify';

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
  const el = h('div', { class: source.className, 'data-type': 'twitter' }, [
    h('em', `Loading ${source.getAttribute('data-src')}...`),
  ]);
  $.ajax(`https://publish.twitter.com/oembed?url=${url.href.replace('?', '&')}&omit_script=true`, {
    dataType: 'jsonp',
    timeout: 10 * 1e3,
    cache: true,
    success({ html }): void {
      el.innerHTML = DOMPurify.sanitize(html);
      if (window.twttr) return void window.twttr.widgets.load(el);
      const id = 'twitter-wjs';
      if (document.getElementById(id)) return;
      document.body.appendChild(h('script', { id, src: 'https://platform.twitter.com/widgets.js' }));
    },
    error({ status, statusText }) {
      assert(Number.isSafeInteger(status));
      define(el, [
        define(parse(`{ ${source.getAttribute('data-src')} }`).querySelector('a')!, {
          class: null,
          target: '_blank',
        }),
        h('pre', `${status}\n${statusText}`),
      ]);
    },
  });
  return el;
}
