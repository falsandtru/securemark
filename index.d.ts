/**
*
* securemark
*
* @author falsandtru https://github.com/falsandtru/securemark
*/

import { Collection } from 'spica/collection';

export function parse(source: string, options?: ParserOptions): DocumentFragment;
export function bind(target: DocumentFragment | HTMLElement | ShadowRoot, settings: ParserSettings): {
  parse: (source: string) => Generator<Progress, undefined, undefined>;
  nearest: (index: number) => HTMLElement | undefined;
  index: (block: HTMLElement) => number;
};
export function render(target: HTMLElement, options?: RenderingOptions): void;
export const caches: Caches;
export function header(source: string): string;
export function headers(source: string): string[];
export function body(source: string): string;
export function normalize(source: string): string;
export function quote(anchor: string, range: Range): string;
export function toc(source: DocumentFragment | HTMLElement | ShadowRoot): HTMLUListElement;
export function info(source: DocumentFragment | HTMLElement | ShadowRoot): Info;
export function context(base: DocumentFragment | HTMLElement | ShadowRoot, bound?: string): (el: Element) => boolean;
export function sync(editor: HTMLElement, viewer: HTMLElement, bottom?: Element | null): () => void;

export type ParserOptions = Omit<Partial<ParserSettings>, 'chunk'>;
export interface ParserSettings {
  // Host URL.
  readonly host?: URL;
  // Id of comments and timelines.
  readonly id?: string;
  // For editing.
  readonly caches?: Partial<Caches>;
  readonly footnotes: {
    readonly annotations: HTMLOListElement;
    readonly references: HTMLOListElement;
  };
  readonly chunk?: boolean;
}

export type Progress =
  | { type: 'segment', value: string; }
  | { type: 'block', value: HTMLElement }
  | { type: 'figure', value: HTMLAnchorElement }
  | { type: 'footnote', value: HTMLLIElement | HTMLElement }
  | { type: 'break' }
  | { type: 'cancel' };

export interface RenderingOptions {
  readonly code?: (target: HTMLElement, cache?: Collection<string, HTMLElement>) => void;
  readonly math?: (target: HTMLElement, cache?: Collection<string, HTMLElement>) => void;
  readonly media?: {
    readonly twitter?: (target: HTMLImageElement, url: URL) => HTMLElement | undefined;
    readonly youtube?: (target: HTMLImageElement, url: URL, cache?: Collection<string, HTMLElement>) => HTMLElement | undefined;
    readonly pdf?: (target: HTMLImageElement, url: URL, cache?: Collection<string, HTMLElement>) => HTMLElement | undefined;
    readonly video?: (target: HTMLImageElement, url: URL, cache?: Collection<string, HTMLElement>) => HTMLVideoElement | undefined;
    readonly audio?: (target: HTMLImageElement, url: URL, cache?: Collection<string, HTMLElement>) => HTMLAudioElement | undefined;
    readonly image?: (target: HTMLImageElement, url: URL, cache?: Collection<string, HTMLElement>) => HTMLImageElement;
  };
  readonly caches?: Partial<Caches>;
}

export interface Caches {
  readonly code: Collection<string, HTMLElement>;
  readonly math: Collection<string, HTMLElement>;
  readonly media: Collection<string, HTMLElement>;
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
