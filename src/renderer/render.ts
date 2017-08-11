import { media } from './render/media';
import { code } from './render/code';
import { math } from './render/math';
import { RenderingOptions } from '../../';

export function render(target: HTMLElement, opts: RenderingOptions = {}): void {
  assert(target instanceof HTMLImageElement === false);
  void [target].concat(Array.from(target.querySelectorAll('img, pre, .math') as NodeListOf<HTMLElement>))
    .forEach(target => {
      switch (true) {
        case target.matches('img[data-src]'): {
          const el = media(target as HTMLImageElement, opts.media);
          const tgt = el instanceof HTMLImageElement || !target.closest('a')
            ? target
            : target.closest('a')!;
          return void tgt.parentElement!.replaceChild(el, tgt);
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
}
