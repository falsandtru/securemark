/**
*
* securemark
*
* @author falsandtru https://github.com/falsandtru/securemark
*/

import { Dict } from 'spica/dict';

export function parse(source: string, options?: ParserOptions): DocumentFragment;
export function bind(target: DocumentFragment | HTMLElement | ShadowRoot, settings: ParserSettings): {
  parse: (source: string) => Generator<Progress, undefined, undefined>;
  nearest: (index: number) => HTMLElement | undefined;
  index: (block: HTMLElement) => number;
};
export function render(source: HTMLElement, options?: RenderingOptions): void;
export const caches: Caches;
export function header(source: string): string;
export function headers(source: string): string[];
export function body(source: string): string;
export function normalize(source: string): string;
export function quote(anchor: string, range: Range): string;
export function toc(source: DocumentFragment | HTMLElement | ShadowRoot): HTMLUListElement;
export function info(source: DocumentFragment | HTMLElement | ShadowRoot): Info;
export function scope(base: DocumentFragment | HTMLElement | ShadowRoot, filter?: string, bound?: string): (el: Element) => boolean;

export type ParserOptions = Omit<Partial<ParserSettings>, 'chunk'>;
export interface ParserSettings {
  // Host URL.
  readonly host?: URL;
  // Alphanumeric ID of comments and timelines.
  readonly id?: string;
  // For editing.
  readonly caches?: Partial<Caches>;
  readonly footnotes: {
    readonly references: HTMLOListElement;
  };
  readonly chunk?: boolean;
}

export type Progress =
  | { readonly type: 'segment'; readonly value: string; }
  | { readonly type: 'block'; readonly value: HTMLElement; }
  | { readonly type: 'figure'; readonly value: HTMLAnchorElement; }
  | { readonly type: 'footnote'; readonly value: HTMLLIElement | HTMLElement; }
  | { readonly type: 'break'; }
  | { readonly type: 'cancel'; };

export interface RenderingOptions {
  readonly code?: (target: HTMLElement, cache?: Dict<string, HTMLElement>) => void;
  readonly math?: (target: HTMLElement, cache?: Dict<string, HTMLElement>) => void;
  readonly media?: {
    readonly twitter?: (source: HTMLImageElement, url: URL) => HTMLElement | undefined;
    readonly youtube?: (source: HTMLImageElement, url: URL) => HTMLElement | undefined;
    readonly pdf?: (source: HTMLImageElement, url: URL) => HTMLElement | undefined;
    readonly video?: (source: HTMLImageElement, url: URL) => HTMLVideoElement | undefined;
    readonly audio?: (source: HTMLImageElement, url: URL) => HTMLAudioElement | undefined;
    readonly image?: (source: HTMLImageElement, url: URL, cache?: Dict<string, HTMLElement>) => HTMLImageElement;
  };
  readonly caches?: Partial<Caches>;
}

export interface Caches {
  readonly code: Dict<string, HTMLElement>;
  readonly math: Dict<string, HTMLElement>;
  readonly media: Dict<string, HTMLElement>;
}

export interface Info {
  readonly url: HTMLAnchorElement[];
  readonly tel: HTMLAnchorElement[];
  readonly email: HTMLAnchorElement[];
  readonly account: HTMLAnchorElement[];
  readonly channel: HTMLAnchorElement[];
  readonly hashtag: HTMLAnchorElement[];
  readonly hashnum: HTMLAnchorElement[];
  readonly reply: HTMLAnchorElement[];
  readonly anchor: HTMLAnchorElement[];
  readonly media: HTMLElement[];
}
