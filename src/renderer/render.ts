import { location } from 'spica/global';
import { RenderingOptions } from '../../';
import { code } from './render/code';
import { math } from './render/math';
import { media } from './render/media';
import { reduce } from 'spica/memoize';

const selector = 'img.media:not(.invalid):not([src])[data-src], a > :not(img).media:not(.invalid), pre.code:not(.invalid), .math:not(.invalid)';

const extend = reduce((opts: RenderingOptions): RenderingOptions =>
  ({ code, math, media: {}, ...opts }));

export function render(target: HTMLElement, opts: RenderingOptions = {}): void {
  opts = extend(opts);
  if (target.classList.contains('invalid')) return;
  const base = location.href;
  if (target.matches(selector)) return void render_(base, target, opts);
  for (let es = target.querySelectorAll<HTMLElement>(selector), i = 0, len = es.length; i < len; ++i) {
    render_(base, es[i], opts);
  }
}

function render_(base: string, target: HTMLElement, opts: RenderingOptions): void {
  assert(!target.matches('.invalid'));
  try {
    switch (true) {
      case !!opts.code
        && !target.firstElementChild
        && target.matches('pre.code'):
        return void opts.code!(target, opts.caches?.code);
      case !!opts.math
        && !target.firstElementChild
        && target.matches('.math'):
        return void opts.math!(target, opts.caches?.math);
      case target.matches('.media:not(img)'):
        assert(target.matches('a > .media'));
        return void target.parentElement!.parentElement!.replaceChild(target, target.parentElement!);
      case !!opts.media
        && target.matches('img.media:not([src])[data-src]'): {
        assert(target.matches('a > .media'));
        const el = media(base, target as HTMLImageElement, opts.media!, opts.caches?.media);
        if (!el) return;
        assert(el.matches('.media'));
        el.setAttribute('data-src', target.getAttribute('data-src')!);
        const scope = el.matches('img')
          ? target
          : target.parentElement as HTMLAnchorElement;
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
