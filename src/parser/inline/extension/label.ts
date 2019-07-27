import { ExtensionParser } from '../../inline';
import { union, subline, focus, verify, surround, convert, fmap } from '../../../combinator';
import { link } from '../link';
import { hasTightText } from '../../util';
import { define } from 'typed-dom';

const parser = focus(
  /^(?:\$[a-z]*)(?:(?:-[a-z][0-9a-z]*)+(?:-0(?:\.0)*)?|-[0-9]+(?:\.[0-9]+)*)/,
  convert(
    query => `[\\${query}]{#}`,
    link));

export const label: ExtensionParser.LabelParser = subline(verify(fmap(
  union([
    surround('[', parser, ']'),
    parser,
  ]),
  ([el]) => [define(el, { class: 'label', 'data-label': el.textContent!.slice(el.textContent![1] === '-' ? 0 : 1), href: null })]),
  ([el]) => hasTightText(el)));

export function index(label: string, index: string): string {
  return isFixed(label)
    ? label.split('-').pop()!
    : increment(
        index,
        isGroup(label)
          ? label.split('-').pop()!.split('.').length
          : index.split('.').length);
}

export function isFixed(label: string): boolean {
  return label.search(/^(?:\$|[a-z]+)-[0-9]+(?:\.[0-9]+)*$/) === 0;
}

export function isGroup(label: string): boolean {
  return label.split('-').pop()!.search(/^0(?:\.0)*$/) === 0
      && !isFixed(label);
}

function increment(index: string, position: number): string {
  assert(index.match(/^[0-9]+(?:\.[0-9]+)*$/));
  assert(position > 0);
  if (index === '0' && position > 1) return increment('1', position);
  const ns = index.split('.');
  const idx: number[] = [];
  for (let i = 0; i < position; ++i) {
    void idx.push(
      i < ns.length
        ? i + 1 < position
          ? +ns[i]
          : +ns[i] + 1
        : 1);
  }
  return idx.join('.');
}
