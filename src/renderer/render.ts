import { RenderingOptions } from '../../';
import { media } from './render/media';
import { code } from './render/code';
import { math } from './render/math';

export function render(target: HTMLElement, opts: RenderingOptions = {}): HTMLElement {
  void [target, ...target.querySelectorAll<HTMLElement>('img, pre, .math')]
    .forEach(target =>
      void new Promise(() => {
        switch (true) {
          case target.matches('img:not([src])[data-src]'): {
            const el = media(target as HTMLImageElement, opts.media);
            const scope = el instanceof HTMLImageElement === false && target.closest('a, h1, h2, h3, h4, h5, h6, p, li, dl, td') instanceof HTMLAnchorElement
              ? target.closest('a')!
              : target;
            return void scope.parentElement!.replaceChild(el, scope);
          }
          case target.matches('pre')
            && target.children.length === 0:
            return void (opts.code || code)(target);
          case target.matches('.math')
            && target.children.length === 0:
            return void (opts.math || math)(target);
          default:
            return;
        }
      }));
  return target;
}
