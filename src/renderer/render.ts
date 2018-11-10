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
        const scope = target.matches('a > .media') && !el.matches('img')
          ? target.closest('a')!
          : target;
        return void scope.parentElement!.replaceChild(el, scope);
      }
      case target.childNodes.length === 0:
      case target.matches('pre, .math'):
        return;
      default:
        return void target.querySelectorAll<HTMLElement>('img.media:not([src])[data-src], a > .media:not(img), pre.code, .math')
          .forEach(el =>
            void render(el, opts));
    }
  }
  catch (reason) {
    console.error(reason);
  }
}
