import { index } from '../parser/inline/extension/label';
import { isGroup } from '../parser/inline';
import { concat } from 'spica/concat';
import { define } from 'typed-dom';

export function figure(source: DocumentFragment | HTMLElement): void {
  const groups = new Map<string, HTMLElement[]>();
  const exclusions = new Set<Element>();
  return void source.querySelectorAll<HTMLElement>('figure[data-label][data-group]')
    .forEach(fig => {
      if (fig.matches('.example figure')) return;
      if (fig.parentElement !== source && fig.parentElement instanceof HTMLQuoteElement) {
        return exclusions.has(fig.parentElement)
          ? undefined
          : void exclusions.add(fig.parentElement) ||
            void figure(fig.parentElement);
      }
      const label = fig.getAttribute('data-label')!;
      const group = fig.getAttribute('data-group')!;
      void groups.set(group, concat(groups.get(group) || [], [fig]));
      assert(groups.has(group));
      const idx = index(label, groups.get(group)!);
      void fig.setAttribute('data-index', idx);
      const figindex = fig.lastElementChild!.previousElementSibling!;
      assert(figindex.matches('.figindex'));
      void define(figindex, group === '$' ? `(${idx})` : `${capitalize(group)}. ${idx}.`);
      if (fig.closest('blockquote')) return;
      void fig.setAttribute('id', `label:${label.split('-', 1)[0]}-${idx}`);
      const query = isGroup(label) ? label.split('-').slice(0, -1).join('-') : label;
      void source.querySelectorAll(`a.label[data-label="${query.replace(/[:$.]/g, '\\$&')}"]`)
        .forEach(ref =>
          void define(ref, { href: `#${fig.id}` }, figindex.textContent!.replace(/[.]$/, '')));
    });
}

function capitalize(label: string): string {
  return label[0].toUpperCase() + label.slice(1);
}
