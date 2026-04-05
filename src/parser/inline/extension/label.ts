import { ExtensionParser } from '../../inline';
import { State, Backtrack } from '../../context';
import { List, Node } from '../../../combinator/parser';
import { union, constraint, backtrack, clear, surround, fmap } from '../../../combinator';
import { str } from '../../source';
import { html } from 'typed-dom/dom';

const syntax = /\$[A-Za-z]*(?:(?:-[A-Za-z][0-9A-Za-z]*)+|-(?:(?:0|[1-9][0-9]*)\.)*(?:0|[1-9][0-9]*)(?![0-9A-Za-z]))/y;
const body = str(syntax);

export function test(source: string): boolean {
  const bracket = source[0] === '[';
  syntax.lastIndex = +bracket;
  if (!syntax.test(source)) return false;
  if (bracket && source[syntax.lastIndex] !== ']') return false;
  return true;
}

export const segment: ExtensionParser.LabelParser.SegmentParser = clear(union([
  backtrack(surround('[', body, ']')),
  body,
]));

export const label: ExtensionParser.LabelParser = constraint(State.label, fmap(
  union([
    backtrack(surround('[', body, ']', false, [1 | Backtrack.common])),
    body,
  ]),
  ([{ value }], _, output) => {
    const label = html('a',
      {
        class: 'label',
        'data-label': value.slice(value[1] === '-' ? 0 : 1).toLowerCase(),
      },
      value);
    output.labels.at(-1)!.push(new Node(label));
    return new List([new Node(label)]);
  }));

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
  return ms.join('.');
}
