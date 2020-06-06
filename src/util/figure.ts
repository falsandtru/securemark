import { Infinity } from 'spica/global';
import { context } from './context';
import { isFixed, isFormatted } from '../parser/inline';
import { number as calculate } from '../parser/inline/extension/label';
import { MultiMap } from 'spica/multimap';
import { define } from 'typed-dom';
import { push, join } from 'spica/array';

export function* figure(
  target: DocumentFragment | HTMLElement | ShadowRoot,
  footnotes?: Readonly<{ annotation: HTMLOListElement; reference: HTMLOListElement; }>,
  opts: Readonly<{
    id?: string;
  }> = {},
): Generator<HTMLAnchorElement, undefined, undefined> {
  const refs = new MultiMap<string, HTMLAnchorElement>(
    [
      ...target.querySelectorAll<HTMLAnchorElement>('a.label'),
      ...footnotes?.annotation.querySelectorAll<HTMLAnchorElement>('a.label') || [],
      ...footnotes?.reference.querySelectorAll<HTMLAnchorElement>('a.label') || [],
    ]
      .filter(context(target))
      .map(el => [el.getAttribute('data-label')!, el]));
  const numbers = new Map<string, string>();
  let base = '0';
  let bases: readonly string[] = base.split('.');
  for (let defs = target.children, i = 0, len = defs.length; i < len; ++i) {
    const def = defs[i];
    if (!['FIGURE', 'H1', 'H2', 'H3'].includes(def.tagName)) continue;
    if (base === '0' && def.tagName[0] === 'H') continue;
    assert(base === '0' || bases.length > 1);
    const label = def.tagName === 'FIGURE'
      ? def.getAttribute('data-label')!
      : `$-${increment(bases, def as HTMLHeadingElement)}`;
    if (label === '$-') continue;
    const group = label.split('-', 1)[0];
    assert(label && group);
    assert(group === def.getAttribute('data-group') || !def.matches('figure'));
    let number = calculate(
      label,
      numbers.has(group) && !isFixed(label)
        ? join(
            numbers.get(group)!.split('.')
              .slice(
                0,
                isFormatted(label)
                  ? label.slice(label.lastIndexOf('-') + 1).split('.').length
                  : bases.length),
            '.')
        : base);
    assert(def.matches('figure') || number.endsWith('.0'));
    if (number.split('.').pop() === '0') {
      assert(isFixed(label));
      switch (true) {
        case number === '0':
          number = `0${'.0'.repeat(bases.length - 1)}`;
          break;
        case number.startsWith('0.'):
          assert(number.endsWith('.0'));
          number = join(
            bases.slice(0)
              .reduce((ns, _, i, bs) => {
                i === ns.length
                  ? bs.length = i
                  : ns[i] = +ns[i] > +bs[i]
                    ? ns[i]
                    : +ns[i] === 0
                      ? bs[i]
                      : `${+bs[i] + 1}`;
                return ns;
              }, number.split('.')),
            '.');
          break;
      }
      base = number;
      bases = base.split('.');
      numbers.clear();
      assert(def.tagName !== 'FIGURE' || !void def.setAttribute('data-number', number));
      continue;
    }
    assert(def.matches('figure:not([style])'));
    assert(number.split('.').pop() !== '0');
    numbers.set(group, number);
    assert(!void def.setAttribute('data-number', number));
    const figid = isFormatted(label) ? label.slice(0, label.lastIndexOf('-')) : label;
    def.setAttribute('id', `label:${opts.id ? `${opts.id}:` : ''}${figid}`);
    const figindex = group === '$' ? `(${number})` : `${capitalize(group)} ${number}`;
    define(
      def.querySelector(':scope > .figindex')!,
      group === '$' ? figindex : `${figindex}. `);
    for (const ref of refs.take(figid, Infinity).filter(ref => ref.hash.slice(1) !== def.id)) {
      if (ref.hash.slice(1) === def.id && ref.textContent === figindex) continue;
      yield define(ref, { href: `#${def.id}` }, figindex);
    }
  }
  return;
}

function increment(bases: readonly string[], el: HTMLHeadingElement): string {
  const cursor = +el.tagName[1] - 1 || 1;
  assert(cursor > 0);
  return cursor < bases.length || bases.length === 1
    ? join(push(bases.slice(0, cursor - 1), [+bases[cursor - 1] + 1, '0']), '.')
    : '';
}

function capitalize(label: string): string {
  return label[0].toUpperCase() + label.slice(1);
}
