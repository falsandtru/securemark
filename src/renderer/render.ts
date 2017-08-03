import { media } from './render/media';
import { math } from './render/math';

export function render(el: HTMLElement): void {
  assert(el instanceof HTMLImageElement === false);
  void [el].concat(Array.from(<NodeListOf<HTMLElement>>el.querySelectorAll('.media, .math')))
    .forEach(el => {
      switch (true) {
        case el.matches('.media[data-src]'):
          assert(el instanceof HTMLImageElement);
          return void media(<HTMLImageElement>el);
        case el.matches('.math'):
          return void math(el);
        default:
          return;
      }
    });
}
