import { media } from './media';

export function render(el: Element): void {
  assert(el instanceof HTMLImageElement === false);
  void [el].concat(Array.from(el.querySelectorAll('img:not([src])[data-src], .math')))
    .forEach(el => {
      switch (true) {
        case el instanceof HTMLImageElement:
          return void media(<HTMLImageElement>el);
        case el.matches('.math'):
          return void MathJax.Hub!.Queue(["Typeset", MathJax.Hub, el]);
        default:
          return;
      }
    });
}
