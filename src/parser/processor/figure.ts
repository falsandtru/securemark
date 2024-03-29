import { number as calculate, isFixed } from '../inline/extension/label';
import { markInvalid, unmarkInvalid } from '../util';
import { MultiQueue } from 'spica/queue';
import { push } from 'spica/array';
import { define } from 'typed-dom/dom';
import { querySelectorAll } from 'typed-dom/query';

export function* figure(
  target: ParentNode & Node,
  notes?: { readonly references: HTMLOListElement; },
  opts: { readonly id?: string; } = {},
): Generator<HTMLAnchorElement | undefined, undefined, undefined> {
  const refs = new MultiQueue<string, HTMLAnchorElement>(push(
    querySelectorAll(target, 'a.label:not(.disabled)[data-label]'),
    notes && querySelectorAll(notes.references, 'a.label:not(.disabled)') || [])
    .map(el => [el.getAttribute('data-label')!, el]));
  const labels = new Set<string>();
  const numbers = new Map<string, string>();
  const scope = target instanceof Element ? ':scope > ' : '';
  let base = '0';
  let bases: readonly string[] = base.split('.');
  let index: readonly string[] = bases;
  for (
    let defs = target.querySelectorAll(`${scope}:is(figure[data-label], h1, h2)`),
        len = defs.length, i = 0; i < len; ++i) {
    yield;
    const def = defs[i];
    if (!scope && def.parentNode !== target) continue;
    const { tagName } = def;
    if (bases.length === 1 && tagName[0] === 'H') continue;
    assert(base === '0' || bases.length > 1);
    const label = tagName === 'FIGURE'
      ? def.getAttribute('data-label')!
      : `$-${increment(index, def as HTMLHeadingElement)}`;
    if (label.endsWith('-')) continue;
    if (label.endsWith('-0')) {
      markInvalid(def, 'figure', 'argument', 'Invalid base index');
      define(def, { hidden: null });
      continue;
    }
    if (tagName === 'FIGURE' && label.endsWith('.0')) {
      // $-x.x.0 is disabled.
      if (label.lastIndexOf('.', label.length - 3) !== -1) {
        markInvalid(def, 'figure', 'argument', 'Base index must be $-x.0 format');
        define(def, { hidden: null });
        continue;
      }
      // $-x.0 after h1-h6.
      if (!/^H[1-6]$/.test(def.previousElementSibling?.tagName ?? '')) {
        markInvalid(def, 'figure', 'position', messages.declaration);
        define(def, { hidden: null });
        continue;
      }
      else if (def.getAttribute('data-invalid-message') === messages.declaration) {
        unmarkInvalid(def);
        define(def, { hidden: null });
      }
    }
    const group = label.split('-', 1)[0];
    assert(label && group);
    assert(group === def.getAttribute('data-group') || !def.matches('figure'));
    let number = calculate(
      label,
      numbers.has(group) && !isFixed(label)
        ? numbers.get(group)!.split('.').slice(0, bases.length).join('.')
        : base);
    assert(def.matches('figure') || number.endsWith('.0'));
    if (number.endsWith('.0')) {
      assert(isFixed(label));
      assert(number.split('.').length <= 2);
      if (group !== '$' || tagName === 'FIGURE' && def.firstChild) continue;
      if (number.startsWith('0.')) {
        assert(number.endsWith('.0'));
        number = index.slice(0)
          .reduce((ns, _, i, xs) => {
            i === ns.length
              ? xs.length = i
              : ns[i] = +ns[i] > +xs[i]
                ? ns[i]
                : +ns[i] === 0
                  ? xs[i]
                  : `${+xs[i] + 1}`;
            return ns;
          }, number.split('.'))
          .join('.');
      }
      base = number;
      bases = index = base.split('.');
      tagName !== 'FIGURE' && numbers.clear();
      assert(def.tagName !== 'FIGURE' || !+def.setAttribute('data-number', number));
      continue;
    }
    assert(def.matches('figure:not([hidden])'));
    assert(number.split('.').pop() !== '0');
    !isFixed(label) && numbers.set(group, number);
    assert(!+def.setAttribute('data-number', number));
    const figindex = group === '$'
      ? `(${number})`
      : `${capitalize(group)}${group === 'fig' ? '.' : ''} ${number}`;
    define(
      def.querySelector(':scope > figcaption > .figindex')!,
      group === '$' ? figindex : `${figindex}. `);
    if (labels.has(label)) {
      if (def.classList.contains('invalid')) continue;
      define(def, { id: null });
      markInvalid(def, 'figure', 'argument', messages.duplicate);
      continue;
    }
    else if (def.getAttribute('data-invalid-message') === messages.duplicate) {
      unmarkInvalid(def);
    }
    labels.add(label);
    opts.id !== '' && def.setAttribute('id', `label:${opts.id ? `${opts.id}:` : ''}${label}`);
    for (const ref of refs.take(label, Infinity)) {
      if (ref.getAttribute('data-invalid-message') === messages.reference) {
        unmarkInvalid(ref);
      }
      if (ref.hash.slice(1) === def.id && ref.innerText === figindex) continue;
      yield define(ref,
        opts.id !== '' ? { href: `#${def.id}` } : { class: `${ref.className} disabled` },
        figindex);
    }
  }
  for (const [, ref] of refs) {
    if (opts.id !== '' && !ref.classList.contains('invalid')) {
      markInvalid(ref, 'label', 'reference', messages.reference);
    }
    yield ref;
  }
}

const messages = {
  declaration: 'Base index declarations must be after level 1 to 6 headings',
  duplicate: 'Duplicate label',
  reference: 'Missing the target figure',
} as const;

function increment(bases: readonly string[], el: HTMLHeadingElement): string {
  const index = (+el.tagName[1] - 1 || 1) - 1;
  assert(index >= 0);
  return index + 1 < bases.length
    ? bases.slice(0, index + 2)
        .map((v, i) => {
          switch (true) {
            case i < index:
              return v;
            case i === index:
              return +v + 1;
            default:
              return 0;
          }
        })
        .join('.')
    : '';
}

function capitalize(label: string): string {
  return label[0].toUpperCase() + label.slice(1);
}
