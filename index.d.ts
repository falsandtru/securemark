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
  code?: (source: HTMLElement) => void;
  math?: (source: HTMLElement) => void;
  media?: {
    twitter?: (url: string) => HTMLElement | void;
    youtube?: (url: string) => HTMLElement | void;
    gist?: (url: string) => HTMLElement | void;
    slideshare?: (url: string) => HTMLElement | void;
    pdf?: (url: string) => HTMLElement | void;
    image?: (source: HTMLImageElement) => HTMLImageElement | HTMLAnchorElement;
  };
}

import { Cache } from 'spica/cache';
export const caches: {
  readonly math: Cache<string, HTMLElement>;
  readonly image: Cache<string, HTMLImageElement>;
};
