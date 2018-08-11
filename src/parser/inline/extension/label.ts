import { ExtensionParser } from '../../inline';
import { union, fmap, match, surround, verify, subline, build } from '../../../combinator';
import '../../source/unescapable';
import { link } from '../link';
import { hasTightText } from '../../util';

export const label: ExtensionParser.LabelParser = subline(verify(fmap(build(() =>
  surround(
    '[:',
    match(
      /^(?:\$|[a-z]+)(?:(?:-[a-z][0-9a-z]*)+(?:-0(?:\.0)*)?|-[0-9]+(?:\.[0-9]+)*)/,
      ([query], rest) =>
        union<ExtensionParser.LabelParser>([link])
          (`[\\${query}](#${makeLabel(query)})${rest}`)),
    ']')),
  ([el]) => {
    void el.setAttribute('class', el.getAttribute('href')!.slice(1));
    return [el];
  }
), ([el]) => hasTightText(el)));

function makeLabel(text: string): string {
  assert(!text.includes('\n'));
  return `label:${text}`;
}

export function index(label: string, figs: HTMLElement[]): string {
  assert(figs.length > 0);
  return isFixed(label)
    ? label.split('-').pop()!
    : increment(
        figs.length === 1 ? '0' : figs[figs.length - 2].getAttribute('data-index')!,
        isGroup(label) ? label.split('-').pop()!.split('.').length : 1);
}

export function isFixed(label: string): boolean {
  return label.split(':').pop()!.search(/^[a-z][0-9a-z]*-[0-9]+(?:\.[0-9]+)*$/) === 0;
}

export function isGroup(label: string): boolean {
  return label.split('-').pop()!.search(/^0(?:\.0)*$/) === 0
      && !isFixed(label);
}

function increment(index: string, position: number): string {
  assert(index.match(/^\d+(?:\.\d+)*$/));
  assert(position > 0);
  if (index === '0' && position > 1) return increment(index, 1);
  const ns = index.split('.');
  const idx: number[] = [];
  for (let i = 0; i < position; ++i) {
    void idx.push(
      i < ns.length
        ? i + 1 < position
          ? +ns[i]
          : +ns[i] + 1
        : i + 1 < position
          ? 0
          : 1);
  }
  return idx.join('.');
}
