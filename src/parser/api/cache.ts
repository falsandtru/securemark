import { Caches } from '../../..';
import { Cache } from 'spica/cache';
import { Clock } from 'spica/clock';

// For rerendering in editing.

export const caches: Caches = {
  code: new Clock<string, HTMLElement>(1000),
  math: new Cache<string, HTMLElement>(1000),
  media: new Clock<string, HTMLElement>(100),
} as const;
