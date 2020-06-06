import { location } from 'spica/global';
import { RenderingOptions } from '../../';
import { code } from './render/code';
import { math } from './render/math';
import { media } from './render/media';
import { URL } from 'spica/url';

const { origin } = location;

export function render(target: HTMLElement, opts: RenderingOptions = {}): void {
  opts = { code, math, media: {}, ...opts };
  try {
    if (target.tagName === 'LI') {
      opts.math && target.querySelectorAll('.math').forEach(el => opts.math?.(el as HTMLElement));
      return;
    }
    switch (true) {
      case target.classList.contains('invalid'):
        return;
      case !!opts.code
        && !target.firstElementChild
        && target.matches('pre.code'):
        return void opts.code!(target);
      case !!opts.math
        && !target.firstElementChild
        && target.matches('.math'):
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
        el.setAttribute('data-src', new URL(target.getAttribute('data-src')!, origin).reference);
        const scope = el.matches('img')
          ? target
          : target.parentElement as HTMLAnchorElement;
        return void scope.parentElement!.replaceChild(el, scope);
      }
      default:
        for (let es = target.querySelectorAll<HTMLElement>('img.media:not([src])[data-src], a > .media:not(img), pre.code, .math'), i = 0, len = es.length; i < len; ++i) {
          const el = es[i];
          render(el, opts);
        }
        return;
    }
  }
  catch (reason) {
    console.error(reason);
  }
}
