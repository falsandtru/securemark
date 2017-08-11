/**
*
* securemark
*
* @author falsandtru https://github.com/falsandtru/securemark
*/

export function parse(source: string): DocumentFragment;
export function bind(el: HTMLElement): (source: string) => HTMLElement[];
export function render(el: HTMLElement, opts?: RenderingOptions): void;

export interface RenderingOptions {
  code?: boolean;
  math?: boolean;
  media?: {
    twitter?: boolean;
    youtube?: boolean;
    gist?: boolean;
    slideshare?: boolean;
    pdf?: boolean;
  };
}

import { Cache } from 'spica/cache';
export const caches: {
  readonly image: Cache<string, HTMLImageElement>;
  readonly math: Cache<string, HTMLElement>;
};
