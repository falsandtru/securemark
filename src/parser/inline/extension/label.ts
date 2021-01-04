import { Array } from 'spica/global';
import { ExtensionParser } from '../../inline';
import { union, validate, guard, creator, surround, clear, fmap } from '../../../combinator';
import { str } from '../../source';
import { join } from 'spica/array';
import { html } from 'typed-dom';

const body = str(/^\$[A-Za-z]*(?:(?:-[A-Za-z][0-9A-Za-z]*(?![0-9A-Za-z]))+|-(?:(?:0|[1-9][0-9]*)\.)*(?:0|[1-9][0-9]*)(?!\.?[0-9A-Za-z]))/);

export const segment: ExtensionParser.LabelParser.SegmentParser = clear(validate(['[$', '$'], union([
  surround('[', body, ']'),
  body,
])));

export const label: ExtensionParser.LabelParser = creator(validate(['[$', '$'], fmap(
  guard(context => context.syntax?.inline?.label ?? true,
  union([
    surround('[', body, ']'),
    body,
  ])),
  ([text]) =>
    [html('a', { class: 'label', 'data-label': text.slice(text[1] === '-' ? 0 : 1).toLowerCase() }, text)])));

export function number(label: string, base: string): string {
  return isFixed(label)
    ? label.slice(label.lastIndexOf('-') + 1)
    : increment(base, base.split('.').length);
}

export function isFixed(label: string): boolean {
  return /^[^-]+-[0-9]+(?:\.[0-9]+)*$/.test(label);
}

function increment(number: string, position: number): string {
  assert(number.match(/^[0-9]+(?:\.[0-9]+)*$/));
  assert(position > 0);
  if (number === '0' && position > 1) return increment('1', position);
  const ns = number.split('.');
  const ms: number[] = Array(position);
  for (let i = 0; i < position; ++i) {
    ms[i] =
      i < ns.length
        ? i + 1 < position
          ? +ns[i]
          : +ns[i] + 1
        : i + 1 < position
          ? 0
          : 1;
  }
  return join(ms, '.');
}
