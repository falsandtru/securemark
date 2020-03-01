import { ExtensionParser } from '../../inline';
import { union, validate, creator, fmap, surround } from '../../../combinator';
import { str } from '../../source';
import { html } from 'typed-dom';
import { join } from 'spica/array';

const body = str(/^(?:\$[a-z]*)(?:(?:-[a-z][0-9a-z]*)+(?:-0(?:\.0){0,2})?|-[0-9]+(?:\.[0-9]+){0,2})/);

export const label: ExtensionParser.LabelParser = creator(validate(['[$', '$'], fmap(
  union([
    surround('[', body, ']'),
    body,
  ]),
  ([text]) =>
    [html('a', { class: 'label', 'data-label': text.slice(text[1] === '-' ? 0 : 1) }, [text])])));

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
  return join(ms, '.');
}
