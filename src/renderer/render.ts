import { RenderingOptions } from '../../';
import { media } from './render/media';
import { code } from './render/code';
import { math } from './render/math';

export function render(target: HTMLElement, opts: RenderingOptions = {}): HTMLElement {
  opts = { code, math, media: {}, ...opts };
  void [target, ...target.querySelectorAll<HTMLElement>('img.media:not([src])[data-src], a > .media:not(img), pre:not(.quote), .math')]
    .forEach(target =>
      void new Promise(() => {
        switch (true) {
          case target.matches('.invalid'):
            return;
          case target.matches('a > .media:not(img)'):
            return void target.parentElement!.parentElement!.replaceChild(target, target.parentElement!);
          case !!opts.media
            && target.matches('img'): {
            assert(target.matches('.media:not([src])[data-src]'));
            const el = media(target as HTMLImageElement, opts.media!);
            if (!el) return;
            const scope = target.matches('a > .media') && !el.matches('img')
              ? target.closest('a')!
              : target;
            return void scope.parentElement!.replaceChild(el, scope);
          }
          case !!opts.code
            && target.matches('pre')
            && target.children.length === 0:
            return void opts.code!(target);
          case !!opts.math
            && target.matches('.math')
            && target.children.length === 0:
            return void opts.math!(target);
          default:
            return;
        }
      }));
  return target;
}
