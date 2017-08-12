import { media } from './render/media';
import { code } from './render/code';
import { math } from './render/math';
import { RenderingOptions } from '../../';

export function render(target: HTMLElement, opts: RenderingOptions = {}): HTMLElement {
  void [target].concat(Array.from(target.querySelectorAll('img, pre, .math') as NodeListOf<HTMLElement>))
    .forEach(target => {
      switch (true) {
        case target.matches('img:not([src])[data-src]'): {
          const content = media(target as HTMLImageElement, opts.media);
          const scope = content instanceof HTMLImageElement === false && target.closest('a, h1, h2, h3, h4, h5, h6, p, li, dl, td') instanceof HTMLAnchorElement
            ? target.closest('a')!
            : target;
          return void scope.parentElement!.replaceChild(content, scope);
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
    });
  return target;
}
