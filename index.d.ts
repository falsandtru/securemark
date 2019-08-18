/**
*
* securemark
*
* @author falsandtru https://github.com/falsandtru/securemark
*/

export function parse(source: string, opts?: ParserOptions): DocumentFragment;
export function bind(target: DocumentFragment | HTMLElement | ShadowRoot, opts?: ParserOptions): (source: string) => Generator<HTMLElement, undefined, undefined>;
export function figure(source: DocumentFragment | HTMLElement | ShadowRoot): void;
export function footnote(source: DocumentFragment | HTMLElement | ShadowRoot, targets: { annotation: HTMLOListElement; authority: HTMLOListElement; }): void;
export function render(target: HTMLElement, opts?: RenderingOptions): void;
export function toc(source: DocumentFragment | HTMLElement | ShadowRoot): HTMLUListElement;

export interface ParserOptions {
  figure?: boolean;
  footnote?: {
    annotation: HTMLOListElement;
    authority: HTMLOListElement;
  };
}

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
  readonly media: Cache<string, HTMLImageElement>;
};
