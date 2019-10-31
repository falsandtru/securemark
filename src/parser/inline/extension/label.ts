import { ExtensionParser } from '../../inline';
import { union, subline, focus, verify, surround, convert, override, fmap } from '../../../combinator';
import { link } from '../link';
import { hasTightText } from '../../util';
import { define } from 'typed-dom';

const parser = focus(
  /^(?:\$[a-z]*)(?:(?:-[a-z][0-9a-z]*)+(?:-0(?:\.0){0,2})?|-[0-9]+(?:\.[0-9]+){0,2})/,
  override({ syntax: { inline: { link: undefined } } },
  convert(
    query => `[\\${query}]{#}`,
    link)));

export const label: ExtensionParser.LabelParser = subline(verify(fmap(
  union([
    surround('[', parser, ']'),
    parser,
  ]),
  ([el]) => [define(el, { class: 'label', 'data-label': el.textContent!.slice(el.textContent![1] === '-' ? 0 : 1), href: null })]),
  ([el]) => hasTightText(el)));

export function number(label: string, base: string): string {
  return isFixed(label)
    ? label.slice(label.lastIndexOf('-') + 1)
    : increment(
        base,
        isFormatted(label)
          ? label.slice(label.lastIndexOf('-') + 1).split('.').length
          : base.split('.').length);
}

export function isFixed(label: string): boolean {
  return /^[^-]+-[0-9]+(?:\.[0-9]+)*$/.test(label);
}

export function isFormatted(label: string): boolean {
  return /^[^-]+.+?-0(?:\.0)*$/.test(label);
}

function increment(number: string, position: number): string {
  assert(number.match(/^[0-9]+(?:\.[0-9]+)*$/));
  assert(position > 0);
  if (number === '0' && position > 1) return increment('1', position);
  const ns = number.split('.');
  const ms: number[] = [];
  for (let i = 0; i < position; ++i) {
    void ms.push(
      i < ns.length
        ? i + 1 < position
          ? +ns[i]
          : +ns[i] + 1
        : i + 1 < position
          ? 0
          : 1);
  }
  return ms.join('.');
}
