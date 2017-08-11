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
  code?: (target: HTMLElement) => void;
  math?: (target: HTMLElement) => void;
  media?: {
    twitter?: (url: string) => HTMLElement | void;
    youtube?: (url: string) => HTMLElement | void;
    gist?: (url: string) => HTMLElement | void;
    slideshare?: (url: string) => HTMLElement | void;
    pdf?: (url: string) => HTMLElement | void;
    image?: (url: string, alt: string) => HTMLImageElement;
  };
}

import { Cache } from 'spica/cache';
export const caches: {
  readonly math: Cache<string, HTMLElement>;
  readonly image: Cache<string, HTMLImageElement>;
};
