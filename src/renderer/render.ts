import { RenderingOptions } from '../../';
import { code } from './render/code';
import { math } from './render/math';
import { media } from './render/media';
import { graph } from './render/graph';

export function render(target: HTMLElement, opts: RenderingOptions = {}): void {
  opts = { code, math, media: {}, graph: {}, ...opts };
  try {
    switch (true) {
      case target.style.display === 'none':
      case target.matches('.invalid'):
        return;
      case !!opts.code
        && target.matches('pre.code')
        && target.children.length === 0:
        return void opts.code!(target);
      case !!opts.math
        && target.matches('.math')
        && target.children.length === 0:
        return void opts.math!(target);
      case target.matches('a > .media:not(img)'):
        return void target.parentElement!.parentElement!.replaceChild(target, target.parentElement!);
      case !!opts.media
        && target.matches('img.media:not([src])[data-src]'): {
        const el = media(target as HTMLImageElement, opts.media!);
        if (!el) return;
        const scope = target.matches('a > .media') && !el.matches('img')
          ? target.closest('a')!
          : target;
        return void scope.parentElement!.replaceChild(el, scope);
      }
      case !!opts.graph
        && target.matches('.graph'):
        return void graph(target, opts.graph!);
      case target.childNodes.length === 0:
      case target.matches('pre, .math, .graph'):
        return;
      default:
        for (const el of target.querySelectorAll<HTMLElement>('img.media:not([src])[data-src], a > .media:not(img), pre.code, .graph, .math')) {
          void render(el, opts);
        }
        return;
    }
  }
  catch (reason) {
    console.error(reason);
  }
}
