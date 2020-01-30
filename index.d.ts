/**
*
* securemark
*
* @author falsandtru https://github.com/falsandtru/securemark
*/

export function parse(source: string, opts?: Partial<ParserConfigs>): DocumentFragment;
// `bind` function yields added or removed child elements of the target container element and the footnote elements.
export function bind(target: DocumentFragment | HTMLElement | ShadowRoot, cfgs: ParserConfigs): (source: string) => Generator<HTMLElement | undefined, undefined, undefined>;
export function render(target: HTMLElement, opts?: RenderingOptions): void;
export function toc(source: DocumentFragment | HTMLElement | ShadowRoot): HTMLUListElement;
export function info(source: DocumentFragment | HTMLElement | ShadowRoot): Info;
export function context(base: DocumentFragment | HTMLElement | ShadowRoot, bound?: string): (el: Element) => boolean;

export interface ParserConfigs {
  footnote: {
    annotation: HTMLOListElement;
    reference: HTMLOListElement;
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

export interface Info {
  hashtag: HTMLAnchorElement[];
  hashref: HTMLAnchorElement[];
  channel: HTMLAnchorElement[];
  account: HTMLAnchorElement[];
  mention: HTMLAnchorElement[];
  url: HTMLAnchorElement[];
  tel: HTMLAnchorElement[];
  email: HTMLAnchorElement[];
  media: HTMLElement[];
}

import { Cache } from 'spica/cache';
export const caches: {
  readonly math: Cache<string, HTMLElement>;
  readonly media: Cache<string, HTMLImageElement>;
};
