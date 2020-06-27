/**
*
* securemark
*
* @author falsandtru https://github.com/falsandtru/securemark
*/

export function header(source: string): string[] | undefined;
export function body(source: string): string;
export function parse(source: string, options?: Partial<ParserSettings>): DocumentFragment;
// The `bind` function yields the elements below.
//   1. Added or removed child elements of the target container element (<any> excluding the others).
//   2. All footnote links (<sup>).
//   3. Added or removed child elements of the footnote elements (<li>).
//   4. Added or changed figure links (<a>).
export function bind(target: DocumentFragment | HTMLElement | ShadowRoot, settings: ParserSettings): (source: string) => Generator<HTMLElement | undefined, undefined, undefined>;
export function render(target: HTMLElement, options?: RenderingOptions): void;
export function toc(source: DocumentFragment | HTMLElement | ShadowRoot): HTMLUListElement;
export function info(source: DocumentFragment | HTMLElement | ShadowRoot): Info;
export function context(base: DocumentFragment | HTMLElement | ShadowRoot, bound?: string): (el: Element) => boolean;

export interface ParserSettings {
  // For servers.
  readonly origin?: string;
  // For comments and timelines.
  readonly id?: string;
  readonly footnotes: {
    readonly annotation: HTMLOListElement;
    readonly reference: HTMLOListElement;
  };
}

export interface RenderingOptions {
  readonly code?: (target: HTMLElement) => void;
  readonly math?: (target: HTMLElement) => void;
  readonly media?: {
    readonly twitter?: (url: URL) => HTMLElement | undefined;
    readonly youtube?: (url: URL) => HTMLElement | undefined;
    readonly gist?: (url: URL) => HTMLElement | undefined;
    readonly slideshare?: (url: URL) => HTMLElement | undefined;
    readonly pdf?: (url: URL) => HTMLElement | undefined;
    readonly video?: (url: URL, alt: string) => HTMLVideoElement | undefined;
    readonly audio?: (url: URL, alt: string) => HTMLAudioElement | undefined;
    readonly image?: (url: URL, alt: string) => HTMLImageElement;
  };
}

export interface Info {
  readonly hashtag: HTMLAnchorElement[];
  readonly hashref: HTMLAnchorElement[];
  readonly channel: HTMLAnchorElement[];
  readonly account: HTMLAnchorElement[];
  readonly mention: HTMLAnchorElement[];
  readonly url: HTMLAnchorElement[];
  readonly tel: HTMLAnchorElement[];
  readonly email: HTMLAnchorElement[];
  readonly media: HTMLElement[];
}

import { Cache } from 'spica/cache';
export const caches: {
  readonly math: Cache<string, HTMLElement>;
  readonly media: Cache<string, HTMLImageElement>;
};
