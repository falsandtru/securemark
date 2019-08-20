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
    if (!['FIGURE', 'H2'].includes(def.tagName)) continue;
    if (def.tagName === 'H2' && base === '0') continue;
    const label = def.tagName === 'FIGURE'
      ? def.getAttribute('data-label')!
      : `$-${+base.split('.', 1)[0] + 1}.0`;
    const group = label.split('-', 1)[0];
    assert(label && group);
    assert(group === def.getAttribute('data-group') || !def.matches('figure'));
    let number = calculate(label, numbers.get(group) || base);
    assert(def.matches('figure') || number.endsWith('.0'));
    if (number.endsWith('.0')) {
      assert(isFixed(label));
      assert(def.matches('figure[style], h2'));
      base = number = number.startsWith('0.')
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
      assert(base.split('.').length > 1);
      void numbers.clear();
      if (def.tagName !== 'FIGURE') continue;
      void def.setAttribute('data-index', number);
      continue;
    }
    assert(def.matches('figure'));
    void numbers.set(group, number);
    void def.setAttribute('data-index', number);
    const figid = isGroup(label) ? label.slice(0, label.lastIndexOf('-')) : label;
    void def.setAttribute('id', `label:${figid}`);
    const figindex = group === '$' ? `(${number})` : `${capitalize(group)}. ${number}`;
    void define([...def.children].find(el => el.classList.contains('figindex'))!, group === '$' ? figindex : `${figindex}. `);
    for (const ref of refs.ref(figid)) {
      void define(ref, { href: `#${def.id}` }, figindex);
    }
  }
}

function capitalize(label: string): string {
  return label[0].toUpperCase() + label.slice(1);
}
