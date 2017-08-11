import { media } from './render/media';
import { code } from './render/code';
import { math } from './render/math';
import { RenderingOptions } from '../../';

export function render(el: HTMLElement, opts: RenderingOptions = {}): void {
  assert(el instanceof HTMLImageElement === false);
  void [el].concat(Array.from(el.querySelectorAll('img, pre, .math') as NodeListOf<HTMLElement>))
    .forEach(el => {
      switch (true) {
        case el.matches('img[data-src]'):
          return void media(el as HTMLImageElement, opts.media);
        case el.matches('pre')
          && el.children.length === 0:
          return void (opts.code || code)(el);
        case el.matches('.math')
          && el.children.length === 0:
          return void (opts.math || math)(el);
        default:
          return;
      }
    });
}
