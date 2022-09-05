import { location } from 'spica/global';
import { RenderingOptions } from '../../';
import { code } from './render/code';
import { math } from './render/math';
import { media } from './render/media';
import { querySelectorAllWith } from 'typed-dom/query';
import { reduce } from 'spica/memoize';

const selector = 'img.media:not(.invalid):not([src])[data-src], a > :not(img).media:not(.invalid), pre.code:not(.invalid), .math:not(.invalid)';

const extend = reduce((opts: RenderingOptions): RenderingOptions =>
  ({ code, math, media: {}, ...opts }));

export function render(source: HTMLElement, opts: RenderingOptions = {}): void {
  opts = extend(opts);
  const base = location.href;
  for (const el of querySelectorAllWith<HTMLElement>(source, selector)) {
    render_(base, el, opts);
  }
}

function render_(base: string, source: HTMLElement, opts: RenderingOptions): void {
  if (source.classList.contains('invalid')) return;
  try {
    switch (true) {
      case !!opts.code
        && !source.firstElementChild
        && source.matches('pre.code'):
        return void opts.code!(source, opts.caches?.code);
      case !!opts.math
        && !source.firstElementChild
        && source.matches('.math'):
        return void opts.math!(source, opts.caches?.math);
      case source.matches('.media:not(img)'):
        assert(source.matches('a > .media'));
        return void source.parentElement!.parentElement!.replaceChild(source, source.parentElement!);
      case !!opts.media
        && source.matches('img.media:not([src])[data-src]'): {
        assert(source.matches('a > .media'));
        const el = media(base, source as HTMLImageElement, opts.media!, opts.caches?.media);
        if (!el) return;
        assert(el.matches('.media'));
        el.setAttribute('data-src', source.getAttribute('data-src')!);
        const scope = el.matches('img')
          ? source
          : source.parentElement as HTMLAnchorElement;
        return void scope.parentElement!.replaceChild(el, scope);
      }
      default:
        return;
    }
  }
  catch (reason) {
    console.error(reason);
  }
}
