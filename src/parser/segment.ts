import { PretextParser, ExtensionBlockParser } from '../parser/block';
import { pretext } from '../parser/block/pretext';
import { extension } from '../parser/block/extension';
import { combine } from '../combinator';

const syntax = /^(?:[^\S\n]*\n)+|^(?:[^\n]*\n)+?[^\S\n]*\n/;
assert(!''.match(syntax));
assert(!' '.match(syntax));

export function segment(source: string): string[] {
  const segments: string[] = [];
  while (source.length > 0) {
    const [, rest] = combine<HTMLElement, [PretextParser, ExtensionBlockParser]>([pretext, extension])(source) || [[], source.slice((source.match(syntax) || [source])[0].length)];
    assert(rest.length < source.length);
    assert(source.endsWith(rest));
    void segments.push(source.slice(0, source.length - rest.length));
    source = rest;
  }
  return segments;
}
