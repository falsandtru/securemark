import DOM from 'typed-dom';
import { parse } from '../parser';

export function gist(source: HTMLImageElement): HTMLElement | void {
  const url = source.getAttribute('data-src')!;
  if (!url.startsWith('https://gist.github.com/')) return;
  return DOM.div({
    class: 'media',
    style: 'position: relative;',
  }, [DOM.em(`loading ${url}`)], () => {
    const outer = document.createElement('div');
    void $.ajax(`${url}.json`, {
      dataType: 'jsonp',
      timeout: 10 * 1e3,
      success({ div, stylesheet, description }) {
        outer.innerHTML = `<div style="position: relative; margin-bottom: -1em;">${div}</div>`;
        const gist = <HTMLElement>outer.querySelector('.gist')!;
        void gist.insertBefore(
          DOM.div({ class: 'gist-description' }, [
            DOM.a({ style: 'text-decoration: none; color: #555; font-size: 14px; font-weight: 600;' }, description, () => {
              const outer = parse(url).querySelector('a')!;
              void outer.removeChild(outer.firstChild!);
              return outer;
            }),
          ]).element,
          gist.firstChild);
        if (document.head.querySelector(`link[rel="stylesheet"][href="${stylesheet}"]`)) return;
        void document.head.appendChild(DOM.link({
          rel: 'stylesheet',
          href: stylesheet,
          crossorigin: 'anonymous',
        }, []).element);
      },
      error({ statusText }) {
        outer.innerHTML = parse(`*${url}\\\n-> ${statusText}*`).querySelector('p')!.innerHTML;
      },
    });
    return outer;
  }).element;
}
