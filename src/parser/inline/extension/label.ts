import { ExtensionParser } from '../../inline';
import { union, subline, validate, rewrite, focus, surround, configure, fmap } from '../../../combinator';
import { html, text } from 'typed-dom';

const body = focus(
  /^(?:\$[a-z]*)(?:(?:-[a-z][0-9a-z]*)+(?:-0(?:\.0){0,2})?|-[0-9]+(?:\.[0-9]+){0,2})/,
  query => [[text(query)], '']);

export const segment: ExtensionParser.LabelParser.SegmentParser = subline(fmap(validate(
  ['[$', '$'],
  union([
    surround('[', body, ']'),
    body,
  ])),
  () => []));

export const label: ExtensionParser.LabelParser = subline(rewrite(segment, fmap(validate(
  ['[$', '$'],
  configure({ syntax: { inline: { link: void 0 } } },
  union([
    surround('[', body, ']'),
    body,
  ]))),
  ([text]) =>
    [html('a', { class: 'label', 'data-label': text.data.slice(text.data[1] === '-' ? 0 : 1) }, [text])])));

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
