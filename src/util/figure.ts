import { Infinity, Map } from 'spica/global';
import { number as calculate, isFixed } from '../parser/inline/extension/label';
import { MultiMap } from 'spica/multimap';
import { define } from 'typed-dom';
import { join } from 'spica/array';

export function* figure(
  target: DocumentFragment | HTMLElement | ShadowRoot,
  footnotes?: Readonly<{ annotation: HTMLOListElement; reference: HTMLOListElement; }>,
  opts: Readonly<{
    id?: string;
  }> = {},
): Generator<HTMLAnchorElement | undefined, undefined, undefined> {
  const refs = new MultiMap<string, HTMLAnchorElement>(
    [
      ...target.querySelectorAll<HTMLAnchorElement>('a.label:not(.disabled)[data-label]'),
      ...footnotes?.annotation.querySelectorAll<HTMLAnchorElement>('a.label:not(.disabled)') || [],
      ...footnotes?.reference.querySelectorAll<HTMLAnchorElement>('a.label:not(.disabled)') || [],
    ]
      .map(el => [el.getAttribute('data-label')!, el]));
  const numbers = new Map<string, string>();
  let base = '0';
  let bases: readonly string[] = base.split('.');
  let index: readonly string[] = bases;
  // Bug: Firefox
  //for (let defs = target.querySelectorAll(':scope > figure[data-label], :scope > h1[id], :scope > h2[id], :scope > h3[id]'), i = 0, len = defs.length; i < len; ++i) {
  for (let defs = target.querySelectorAll('figure[data-label], h1[id], h2[id], h3[id]'), i = 0, len = defs.length; i < len; ++i) {
    yield;
    const def = defs[i];
    if (def.parentNode !== target) continue;
    if (bases.length === 1 && def.tagName[0] === 'H') continue;
    assert(base === '0' || bases.length > 1);
    const label = def.tagName === 'FIGURE'
      ? def.getAttribute('data-label')!
      : `$-${increment(index, def as HTMLHeadingElement)}`;
    if (label.endsWith('-')) continue;
    if (label.endsWith('-0')) continue;
    if (def.tagName === 'FIGURE' && label.endsWith('.0')) {
      // $-x.0 after h1 or h2.
      if (label.lastIndexOf('.', label.length - 3) < 0 && !(+def.previousElementSibling?.tagName[1]! <= 2)) continue;
      // $-x.x.0 is disabled.
      if (label.lastIndexOf('.', label.length - 3) > 0) continue;
    }
    const group = label.split('-', 1)[0];
    assert(label && group);
    assert(group === def.getAttribute('data-group') || !def.matches('figure'));
    let number = calculate(
      label,
      numbers.has(group) && !isFixed(label)
        ? join(numbers.get(group)!.split('.').slice(0, bases.length), '.')
        : base);
    assert(def.matches('figure') || number.endsWith('.0'));
    if (number.endsWith('.0')) {
      assert(isFixed(label));
      if (number.split('.').length > 2) continue;
      if (group !== '$' || def.tagName === 'FIGURE' && def.firstChild) continue;
      if (number.startsWith('0.')) {
        assert(number.endsWith('.0'));
        number = join(
          index.slice(0)
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
      }
      base = number;
      bases = index = base.split('.');
      numbers.clear();
      assert(def.tagName !== 'FIGURE' || !void def.setAttribute('data-number', number));
      continue;
    }
    assert(def.matches('figure:not([style])'));
    assert(number.split('.').pop() !== '0');
    !isFixed(label) && numbers.set(group, number);
    assert(!void def.setAttribute('data-number', number));
    opts.id !== '' && def.setAttribute('id', `label:${opts.id ? `${opts.id}:` : ''}${label}`);
    const figindex = group === '$' ? `(${number})` : `${capitalize(group)} ${number}`;
    define(
      def.querySelector(':scope > .figindex')!,
      group === '$' ? figindex : `${figindex}. `);
    for (const ref of refs.take(label, Infinity)) {
      if (ref.hash.slice(1) === def.id && ref.textContent === figindex) continue;
      yield define(ref, opts.id !== '' ? { href: `#${def.id}` } : { class: `${ref.className} disabled` }, figindex);
    }
  }
  for (const [, ref] of refs) {
    if (opts.id !== '') {
      define(ref, {
        class: `${ref.className} disabled invalid`,
        'data-invalid-syntax': 'label',
        'data-invalid-type': 'reference',
        'data-invalid-message': `Missing the reference.`,
      });
    }
    yield ref;
  }
  return;
}

function increment(bases: readonly string[], el: HTMLHeadingElement): string {
  const index = (+el.tagName[1] - 1 || 1) - 1;
  assert(index >= 0);
  return index < bases.length - 1
    ? join(
        bases.slice(0, index + 2).map((v, i) => {
          switch (true) {
            case i < index:
              return v;
            case i === index:
              return +v + 1;
            default:
              return 0;
          }
        }),
        '.')
    : '';
}

function capitalize(label: string): string {
  return label[0].toUpperCase() + label.slice(1);
}
