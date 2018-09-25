import { index } from '../parser/inline/extension/label';
import { isGroup } from '../parser/inline';
import { concat } from 'spica/concat';
import { define } from 'typed-dom';

export function figure(source: DocumentFragment | HTMLElement): void {
  const groups = new Map<string, HTMLElement[]>();
  const exclusions = new Set<Element>(source.querySelectorAll('.example figure'));
  return void source.querySelectorAll<HTMLElement>('figure[class^="label:"]')
    .forEach(figure => {
      if (exclusions.has(figure)) return;
      const label = figure.className;
      const group = figure.getAttribute('data-group')!;
      void groups.set(group, concat(groups.get(group) || [], [figure]));
      assert(groups.has(group));
      const idx = index(label, groups.get(group)!);
      void figure.setAttribute('data-index', idx);
      void figure.setAttribute('id', `${label.split('-', 1)[0]}-${idx}`);
      const figindex = figure.lastElementChild!.previousElementSibling!;
      assert(figindex.matches('.figindex'));
      void define(figindex, group === '$' ? `(${idx})` : `${capitalize(group)}. ${idx}.`);
      const query = isGroup(label) ? label.split('-').slice(0, -1).join('-') : label;
      void source.querySelectorAll(`a.${query.replace(/[:$.]/g, '\\$&')}`)
        .forEach(ref =>
          void define(ref, { href: `#${figure.id}` }, figindex.textContent!.replace(/[.]$/, '')));
    });
}

function capitalize(label: string): string {
  return label[0].toUpperCase() + label.slice(1);
}
