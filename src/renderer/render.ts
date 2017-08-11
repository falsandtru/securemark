import { media } from './render/media';
import { code } from './render/code';
import { math } from './render/math';
import { RenderingOptions } from '../../';

export function render(el: HTMLElement, opts: RenderingOptions = {}): void {
  assert(el instanceof HTMLImageElement === false);
  void [el].concat(Array.from(<NodeListOf<HTMLElement>>el.querySelectorAll('img, pre, .math')))
    .forEach(el => {
      switch (true) {
        case el.matches('img[data-src]'):
          return void media(<HTMLImageElement>el, opts.media);
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
