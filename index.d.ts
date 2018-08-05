/**
*
* securemark
*
* @author falsandtru https://github.com/falsandtru/securemark
*/

export function parse(source: string): DocumentFragment;
export function bind(target: DocumentFragment | HTMLElement): (source: string) => Iterable<HTMLElement>;
export function figure(source: DocumentFragment | HTMLElement, header?: (type: string, index: string) => string): void;
export function footnote(source: DocumentFragment | HTMLElement, targets: { annotation: HTMLOListElement; authority: HTMLOListElement; }): void;
export function toc(source: DocumentFragment | HTMLElement): HTMLUListElement;
export function render(target: HTMLElement, opts?: RenderingOptions): void;

export interface RenderingOptions {
  code?: (target: HTMLElement) => void;
  math?: (target: HTMLElement) => void;
  media?: {
    twitter?: (url: URL) => HTMLElement | undefined;
    youtube?: (url: URL) => HTMLElement | undefined;
    gist?: (url: URL) => HTMLElement | undefined;
    slideshare?: (url: URL) => HTMLElement | undefined;
    pdf?: (url: URL) => HTMLElement | undefined;
    video?: (url: URL, alt: string) => HTMLVideoElement | undefined;
    audio?: (url: URL, alt: string) => HTMLAudioElement | undefined;
    image?: (url: URL, alt: string) => HTMLImageElement;
  };
}

import { Cache } from 'spica/cache';
export const caches: {
  readonly math: Cache<string, HTMLElement>;
  readonly media: {
    readonly image: Cache<string, HTMLImageElement>;
  };
};
