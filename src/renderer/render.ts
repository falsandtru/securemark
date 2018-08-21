import { RenderingOptions } from '../../';
import { media } from './render/media';
import { code } from './render/code';
import { math } from './render/math';

export function render(target: HTMLElement, opts: RenderingOptions = {}): HTMLElement {
  opts = { code, math, media: {}, ...opts };
  void [target, ...target.querySelectorAll<HTMLElement>('a > .media:not(img), img, pre, .math')]
    .forEach(target =>
      void new Promise(() => {
        switch (true) {
          case target.matches('.invalid'):
            return;
          case target.matches('a > .media:not(img)'):
            return void target.parentElement!.parentElement!.replaceChild(target, target.parentElement!);
          case !!opts.media
            && target.matches('img:not([src])[data-src]'): {
            const el = media(target as HTMLImageElement, opts.media!);
            if (!el) return;
            const scope = el instanceof HTMLImageElement === false && target.closest('a, h1, h2, h3, h4, h5, h6, p, li, dl, td') instanceof HTMLAnchorElement
              ? target.closest('a')!
              : target;
            return void scope.parentElement!.replaceChild(el, scope);
          }
          case !!opts.code
            && target.matches('pre'):
            return target.children.length === 0
              ? void opts.code!(target)
              : void 0;
          case !!opts.math
            && target.matches('.math'):
            return target.children.length === 0
              ? void opts.math!(target)
              : void 0;
          default:
            return;
        }
      }));
  return target;
}
