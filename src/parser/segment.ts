import { PreTextParser, ExtensionParser } from '../parser/block';
import { pretext } from '../parser/block/pretext';
import { extension } from '../parser/block/extension';
import { compose } from '../combinator/compose';
import { loop } from '../combinator/loop';

const syntax = /^(?:\s*?\n)+|^(?:[^\n]*\n)+?\s*?\n/;
assert(!''.match(syntax));
assert(!' '.match(syntax));

export function segment(source: string): string[] {
  const segments: string[] = [];
  while (true) {
    const [, rest] = loop(compose<[PreTextParser, ExtensionParser], HTMLElement>([pretext, extension]))(source) || [[], source.slice((source.match(syntax) || [source])[0].length)];
    void segments.push(source.slice(0, source.length - rest.length));
    assert(source === '' || source.length > rest.length);
    source = source.slice(source.length - rest.length);
    source = rest;
    if (source === '') break;
  }
  assert(segment.length > 0);
  return segments;
}
