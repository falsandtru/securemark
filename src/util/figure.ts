import { context } from './context';
import { isGroup, isFixed } from '../parser/inline';
import { number as calculate } from '../parser/inline/extension/label';
import { MultiMap } from 'spica/multimap';
import { define } from 'typed-dom';

export function figure(source: DocumentFragment | HTMLElement | ShadowRoot): void {
  const refs = new MultiMap<string, Element>(
    [...source.querySelectorAll('a.label')]
      .filter(context(source, 'blockquote, aside'))
      .map(el => [el.getAttribute('data-label')!, el]));
  const numbers = new Map<string, string>();
  let base = '0';
  for (const def of source.children) {
    if (!['FIGURE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(def.tagName)) continue;
    if (base === '0' && def.tagName[0] === 'H') continue;
    assert(base === '0' || base.split('.').length > 1);
    const label = def.tagName === 'FIGURE'
      ? def.getAttribute('data-label')!
      : `$-${l2n(+def.tagName[1] - 1 || 1, base)}`;
    if (label === '$-') continue;
    const group = label.split('-', 1)[0];
    assert(label && group);
    assert(group === def.getAttribute('data-group') || !def.matches('figure'));
    let number = calculate(label, numbers.get(group) || base);
    assert(def.matches('figure') || number.endsWith('.0'));
    if (number === '0' || number.endsWith('.0')) {
      if (number === '0') {
        number = [...'0'.repeat(base.split('.').length)].join('.');
      }
      else if (number.endsWith('.0')) {
        assert(isFixed(label));
        number = number.startsWith('0.')
          ? base.split('.')
              .reduce((idx, _, i, base) => {
                i === idx.length
                  ? base.length = i
                  : idx[i] = +idx[i] > +base[i]
                    ? idx[i]
                    : +idx[i] === 0
                      ? base[i]
                      : `${+base[i] + 1}`;
                return idx;
              }, number.split('.'))
              .join('.')
          : number;
      }
      base = number;
      void numbers.clear();
      if (def.tagName !== 'FIGURE') continue;
      void def.setAttribute('data-number', number);
      continue;
    }
    assert(def.matches('figure:not([style])'));
    assert(number.split('.').pop() !== '0');
    void numbers.set(group, number);
    void def.setAttribute('data-number', number);
    const figid = isGroup(label) ? label.slice(0, label.lastIndexOf('-')) : label;
    void def.setAttribute('id', `label:${figid}`);
    const figindex = group === '$' ? `(${number})` : `${capitalize(group)}. ${number}`;
    void define([...def.children].find(el => el.classList.contains('figindex'))!, group === '$' ? figindex : `${figindex}. `);
    for (const ref of refs.ref(figid)) {
      void define(ref, { href: `#${def.id}` }, figindex);
    }
  }
}

function l2n(cursor: number, base: string): string {
  assert(cursor > 0);
  const bases = base.split('.');
  return cursor < bases.length || bases.length === 1
    ? [...bases.slice(0, cursor - 1), +bases[cursor - 1] + 1, '0'].join('.')
    : '';
}

function capitalize(label: string): string {
  return label[0].toUpperCase() + label.slice(1);
}
