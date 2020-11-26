import { Cache } from 'spica/cache';

// For rerendering in editing.

export const caches = {
  code: new Cache<string, HTMLElement>(10),
  math: new Cache<string, HTMLElement>(20),
  media: new Cache<string, HTMLElement>(10),
} as const;
