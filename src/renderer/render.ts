import { media } from './render/media';
import { code } from './render/code';
import { math } from './render/math';
import { RenderingOptions } from '../../';

export function render(el: HTMLElement, opts: RenderingOptions = {}): void {
  assert(el instanceof HTMLImageElement === false);
  void [el].concat(Array.from(<NodeListOf<HTMLElement>>el.querySelectorAll('img[data-src], pre, .math')))
    .forEach(el => {
      switch (true) {
        case el.matches('img'):
          return void media(<HTMLImageElement>el, opts.media);
        case opts.code !== false
          && el.matches('pre'):
          return void code(el);
        case opts.math !== false
          && el.matches('.math'):
          return void math(el);
        default:
          return;
      }
    });
}
