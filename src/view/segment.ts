import { PreTextParser, ExtensionParser } from '../syntax/block';
import { pretext } from '../syntax/block/pretext';
import { extension } from '../syntax/block/extension';
import { compose } from '../parser/compose';
import { loop } from '../parser/loop';

export function segment(source: string): string[] {
  const segments: string[] = [];
  while (true) {
    const [, rest] = loop(compose<[PreTextParser, ExtensionParser], HTMLElement>([pretext, extension]))(source) || block(source);
    void segments.push(source.slice(0, source.length - rest.length));
    assert(source === '' || source.length > rest.length);
    source = source.slice(source.length - rest.length);
    source = rest;
    if (source === '') break;
  }
  assert(segment.length > 0);
  return segments;
}

const syntax = /^(?:[^\n]+\n)+\s*?\n|^(?:[ \t]*\n)+|^.*\n(?=```|~~~)/;
assert(!''.match(syntax));
assert(!' '.match(syntax));
function block(source: string): [never[], string] {
  return [[], source.slice((source.match(syntax) || [source])[0].length)];
}
