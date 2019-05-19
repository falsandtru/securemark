import { RenderingOptions } from '../../';
import { code } from './render/code';
import { math } from './render/math';
import { media } from './render/media';

export function render(target: HTMLElement, opts: RenderingOptions = {}): void {
  opts = { code, math, media: {}, ...opts };
  try {
    switch (true) {
      case target.style.display === 'none':
      case target.matches('.invalid'):
        return;
      case !!opts.code
        && target.matches('pre.code')
        && target.children.length === 0:
        return void opts.code!(target);
      case !!opts.math
        && target.matches('.math')
        && target.children.length === 0:
        return void opts.math!(target);
      case target.matches('a > .media:not(img)'):
        return void target.parentElement!.parentElement!.replaceChild(target, target.parentElement!);
      case !!opts.media
        && target.matches('img.media:not([src])[data-src]'): {
        const el = media(target as HTMLImageElement, opts.media!);
        if (!el) return;
        void el.classList.add('media');
        void el.setAttribute('data-src', new URL(target.getAttribute('data-src')!, window.location.href).href);
        const scope = target.matches('a > .media') && !el.matches('img')
          ? target.closest('a')!
          : target;
        return void scope.parentElement!.replaceChild(el, scope);
      }
      default:
        for (const el of target.querySelectorAll<HTMLElement>('img.media:not([src])[data-src], a > .media:not(img), pre.code, .graph, .math')) {
          void render(el, opts);
        }
        return;
    }
  }
  catch (reason) {
    console.error(reason);
  }
}
