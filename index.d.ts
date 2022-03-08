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
export function render(source: HTMLElement, options?: RenderingOptions): void;
export const caches: Caches;
export function header(source: string): string;
export function headers(source: string): string[];
export function body(source: string): string;
export function normalize(source: string): string;
export function quote(anchor: string, range: Range): string;
export function toc(source: DocumentFragment | HTMLElement | ShadowRoot): HTMLUListElement;
export function info(source: DocumentFragment | HTMLElement | ShadowRoot): Info;
export function scope(base: DocumentFragment | HTMLElement | ShadowRoot, bound?: string): (el: Element) => boolean;
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
    readonly twitter?: (source: HTMLImageElement, url: URL) => HTMLElement | undefined;
    readonly youtube?: (source: HTMLImageElement, url: URL) => HTMLElement | undefined;
    readonly pdf?: (source: HTMLImageElement, url: URL) => HTMLElement | undefined;
    readonly video?: (source: HTMLImageElement, url: URL) => HTMLVideoElement | undefined;
    readonly audio?: (source: HTMLImageElement, url: URL) => HTMLAudioElement | undefined;
    readonly image?: (source: HTMLImageElement, url: URL, cache?: Collection<string, HTMLElement>) => HTMLImageElement;
  };
  readonly caches?: Partial<Caches>;
}

export interface Caches {
  readonly code: Collection<string, HTMLElement>;
  readonly math: Collection<string, HTMLElement>;
  readonly media: Collection<string, HTMLElement>;
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
