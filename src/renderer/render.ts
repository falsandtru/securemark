import { code } from './render/code';
import { math } from './render/math';
import { media } from './render/media';
import { RenderingOptions } from '../../';

export function render(el: HTMLElement, opts: RenderingOptions = {}): void {
  assert(el instanceof HTMLImageElement === false);
  void [el].concat(Array.from(<NodeListOf<HTMLElement>>el.querySelectorAll('.media, pre, .math')))
    .forEach(el => {
      switch (true) {
        case opts.code !== false
          && el.matches('pre'):
          return void code(el);
        case opts.math !== false
          && el.matches('.math'):
          return void math(el);
        case el.matches('.media[data-type][data-src]')
          && el instanceof HTMLImageElement:
          return void media(<HTMLImageElement>el, opts.media);
        default:
          return;
      }
    });
}
