import { Infinity, Set, Map } from 'spica/global';
import { number as calculate, isFixed } from '../inline/extension/label';
import { define } from 'typed-dom';
import { MultiMap } from 'spica/multimap';
import { push, join } from 'spica/array';

export function* figure(
  target: ParentNode & Node,
  footnotes?: Readonly<{ annotations: HTMLOListElement; references: HTMLOListElement; }>,
  opts: Readonly<{
    id?: string;
  }> = {},
): Generator<HTMLAnchorElement | undefined, undefined, undefined> {
  const refs = new MultiMap<string, HTMLAnchorElement>(push(push(push([],
    target.querySelectorAll<HTMLAnchorElement>('a.label:not(.disabled)[data-label]')),
    footnotes?.annotations.querySelectorAll<HTMLAnchorElement>('a.label:not(.disabled)') ?? []),
    footnotes?.references.querySelectorAll<HTMLAnchorElement>('a.label:not(.disabled)') ?? [])
    .map(el => [el.getAttribute('data-label')!, el]));
  const labels = new Set<string>();
  const numbers = new Map<string, string>();
  let base = '0';
  let bases: readonly string[] = base.split('.');
  let index: readonly string[] = bases;
  // Bug: Firefox
  //for (let defs = target.querySelectorAll(':scope > figure[data-label], :scope > h1, :scope > h2'), i = 0, len = defs.length; i < len; ++i) {
  for (
    let defs = target.querySelectorAll('figure[data-label], h1, h2'),
        i = 0, len = defs.length; i < len; ++i) {
    yield;
    const def = defs[i];
    if (def.parentNode !== target) continue;
    if (bases.length === 1 && def.tagName[0] === 'H') continue;
    assert(base === '0' || bases.length > 1);
    const label = def.tagName === 'FIGURE'
      ? def.getAttribute('data-label')!
      : `$-${increment(index, def as HTMLHeadingElement)}`;
    if (label.endsWith('-')) continue;
    if (label.endsWith('-0')) {
      define(def, {
        class: void def.classList.add('invalid'),
        'data-invalid-syntax': 'figure',
        'data-invalid-type': 'argument',
        'data-invalid-message': 'Index 0 is not allowed',
        hidden: null,
      });
      continue;
    }
    if (def.tagName === 'FIGURE' && label.endsWith('.0')) {
      // $-x.0 after h1 or h2.
      if (!['H1', 'H2'].includes(def.previousElementSibling?.tagName!)) {
        define(def, {
          class: void def.classList.add('invalid'),
          'data-invalid-syntax': 'figure',
          'data-invalid-type': 'position',
          'data-invalid-message': 'Base indexes must be after level 1(#) or 2(##) headings',
          hidden: null,
        });
        continue;
      }
      else if (def.classList.contains('invalid')) {
        define(def, {
          class: void def.classList.remove('invalid'),
          'data-invalid-syntax': null,
          'data-invalid-type': null,
          'data-invalid-message': null,
          hidden: '',
        });
      }
      // $-x.x.0 is disabled.
      if (label.lastIndexOf('.', label.length - 3) !== -1) {
        define(def, {
          class: void def.classList.add('invalid'),
          'data-invalid-syntax': 'figure',
          'data-invalid-type': 'argument',
          'data-invalid-message': `Base index's format must be $-x.0`,
          hidden: null,
        });
        continue;
      }
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
      assert(number.split('.').length <= 2);
      if (group !== '$' || def.tagName === 'FIGURE' && def.firstChild) continue;
      if (number.startsWith('0.')) {
        assert(number.endsWith('.0'));
        number = join(
          index.slice(0)
            .reduce((ns, _, i, xs) => {
              i === ns.length
                ? xs.length = i
                : ns[i] = +ns[i] > +xs[i]
                  ? ns[i]
                  : +ns[i] === 0
                    ? xs[i]
                    : `${+xs[i] + 1}`;
              return ns;
            }, number.split('.')),
          '.');
      }
      base = number;
      bases = index = base.split('.');
      numbers.clear();
      assert(def.tagName !== 'FIGURE' || !+def.setAttribute('data-number', number));
      continue;
    }
    assert(def.matches('figure:not([hidden])'));
    assert(number.split('.').pop() !== '0');
    !isFixed(label) && numbers.set(group, number);
    assert(!+def.setAttribute('data-number', number));
    opts.id !== '' && def.setAttribute('id', `label:${opts.id ? `${opts.id}:` : ''}${label}`);
    const figindex = group === '$'
      ? `(${number})`
      : `${capitalize(group)}${group === 'fig' ? '.' : ''} ${number}`;
    define(
      def.querySelector(':scope > figcaption > .figindex')!,
      group === '$' ? figindex : `${figindex}. `);
    if (labels.has(label)) {
      if (def.classList.contains('invalid') &&
          def.getAttribute('data-invalid-message') !== 'Duplicate label') continue;
      define(def, {
        id: null,
        class: void def.classList.add('invalid'),
        'data-invalid-syntax': 'figure',
        'data-invalid-type': 'argument',
        'data-invalid-message': 'Duplicate label',
      });
      continue;
    }
    else {
      labels.add(label);
      define(def, {
        class: void def.classList.remove('invalid'),
        'data-invalid-syntax': null,
        'data-invalid-type': null,
        'data-invalid-message': null,
      });
    }
    for (const ref of refs.take(label, Infinity)) {
      if (ref.hash.slice(1) === def.id && ref.innerText === figindex) continue;
      yield define(ref,
        opts.id !== '' ? { href: `#${def.id}` } : { class: `${ref.className} disabled` },
        figindex);
    }
  }
  for (const [, ref] of refs) {
    if (opts.id !== '') {
      define(ref, {
        class: `${ref.className} disabled invalid`,
        'data-invalid-syntax': 'label',
        'data-invalid-type': 'reference',
        'data-invalid-message': 'Missing the target figure',
      });
    }
    yield ref;
  }
  return;
}

function increment(bases: readonly string[], el: HTMLHeadingElement): string {
  const index = (+el.tagName[1] - 1 || 1) - 1;
  assert(index >= 0);
  return index + 1 < bases.length
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
