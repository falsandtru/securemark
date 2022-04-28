import { undefined } from 'spica/global';
import { html } from 'typed-dom/dom';

export function youtube(source: HTMLImageElement, url: URL): HTMLElement | undefined {
  const id = resolve(url);
  if (!id) return;
  return html('div', { class: source.className, 'data-type': 'youtube' }, [
    html('iframe', {
      src: `https://www.youtube.com/embed/${id}`,
      allow: 'fullscreen',
      loading: 'lazy',
    }),
  ]);
}

function resolve(url: URL): string | undefined {
  switch (url.origin) {
    case 'https://www.youtube.com':
      return url.pathname.match(/^\/watch\/?$/)
        ? url.searchParams.get('v')?.concat(url.search.replace(/([?&])v=[^&#]*&?/g, '$1'), url.hash)
        : undefined;
    case 'https://youtu.be':
      return url.pathname.match(/^\/[\w-]+\/?$/)
        ? url.href.slice(url.origin.length)
        : undefined;
    default:
      return;
  }
}
