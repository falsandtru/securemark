import { Caches } from '../../..';
import { Cache } from 'spica/cache';

// For rerendering in editing.

export const caches: Caches = {
  code: new Cache<string, HTMLElement>(100),
  math: new Cache<string, HTMLElement>(100),
  media: new Cache<string, HTMLElement>(100),
} as const;
