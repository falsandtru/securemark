/**
*
* securemark
*
* @author falsandtru https://github.com/falsandtru/securemark
*/

export function parse(source: string): DocumentFragment;
export function bind(target: HTMLElement): (source: string) => Iterable<HTMLElement>;
export function escape(source: string): string;
export function render(target: HTMLElement, opts?: RenderingOptions): void;

export interface RenderingOptions {
  code?: (target: HTMLElement) => void;
  math?: (target: HTMLElement) => void;
  media?: {
    twitter?: (url: string) => HTMLElement;
    youtube?: (url: string) => HTMLElement;
    gist?: (url: string) => HTMLElement;
    slideshare?: (url: string) => HTMLElement;
    pdf?: (url: string) => HTMLElement;
    video?: (url: string, alt: string) => HTMLVideoElement;
    audio?: (url: string, alt: string) => HTMLAudioElement;
    image?: (url: string, alt: string) => HTMLImageElement;
  };
}

import { Cache } from 'spica/cache';
export const caches: {
  readonly math: Cache<string, HTMLElement>;
  readonly media: {
    readonly image: Cache<string, HTMLImageElement>;
  };
};
