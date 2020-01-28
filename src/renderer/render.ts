import { location } from 'spica/global';
import { RenderingOptions } from '../../';
import { code } from './render/code';
import { math } from './render/math';
import { media } from './render/media';
import { URL } from 'spica/url';

export function render(target: HTMLElement, opts: RenderingOptions = {}): void {
  opts = { code, math, media: {}, ...opts };
  try {
    switch (true) {
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
      case target.matches('.media:not(img)'):
        assert(target.matches('a > .media'));
        return void target.parentElement!.parentElement!.replaceChild(target, target.parentElement!);
      case !!opts.media
        && target.matches('img.media:not([src])[data-src]'): {
        assert(target.matches('a > .media'));
        const el = media(target as HTMLImageElement, opts.media!);
        if (!el) return;
        assert(el.matches('.media'));
        void el.setAttribute('data-src', new URL(target.getAttribute('data-src')!, location.href).reference);
        const scope = el.matches('img')
          ? target
          : target.parentElement as HTMLAnchorElement;
        return void scope.parentElement!.replaceChild(el, scope);
      }
      default:
        for (const el of target.querySelectorAll<HTMLElement>('img.media:not([src])[data-src], a > .media:not(img), pre.code, .math')) {
          void render(el, opts);
        }
        return;
    }
  }
  catch (reason) {
    console.error(reason);
  }
}
