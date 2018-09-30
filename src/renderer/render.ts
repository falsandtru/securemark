import { RenderingOptions } from '../../';
import { media } from './render/media';
import { code } from './render/code';
import { math } from './render/math';

export function render(target: HTMLElement, opts: RenderingOptions = {}): HTMLElement {
  opts = { code, math, media: {}, ...opts };
  try {
    switch (true) {
      case target.style.display === 'none':
      case target.matches('.invalid'):
        // @ts-ignore
        return;
      case target.matches('a > .media:not(img)'):
        // @ts-ignore
        return void target.parentElement!.parentElement!.replaceChild(target, target.parentElement!);
      case !!opts.media
        && target.matches('img.media:not([src])[data-src]'): {
        const el = media(target as HTMLImageElement, opts.media!);
        // @ts-ignore
        if (!el) return;
        const scope = target.matches('a > .media') && !el.matches('img')
          ? target.closest('a')!
          : target;
        // @ts-ignore
        return void scope.parentElement!.replaceChild(el, scope);
      }
      case !!opts.code
        && target.matches('pre:not(.quote)')
        && target.children.length === 0:
        // @ts-ignore
        return void opts.code!(target);
      case !!opts.math
        && target.matches('.math')
        && target.children.length === 0:
        // @ts-ignore
        return void opts.math!(target);
      default:
        // @ts-ignore
        return void target.querySelectorAll<HTMLElement>('img.media:not([src])[data-src], a > .media:not(img), pre:not(.quote), .math')
          .forEach(el =>
            void render(el, opts));
    }
  }
  catch (reason) {
    console.error(reason);
  }
  finally {
    return target;
  }
}
