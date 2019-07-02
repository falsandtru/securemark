import { text } from '../parser/inline/extension/indexer';
import { html, define } from 'typed-dom';

export function footnote(source: DocumentFragment | HTMLElement | ShadowRoot, targets: { annotation: HTMLOListElement; authority: HTMLOListElement; }): void {
  void annotation(source, targets.annotation);
  void authority(source, targets.authority);
}

export const annotation = build('annotation', n => `*${n}`);
export const authority = build('authority', n => `[${n}]`);

function build(category: string, marker: (index: number) => string): (source: DocumentFragment | HTMLElement | ShadowRoot, target: HTMLOListElement) => void {
  assert(category.match(/^[a-z]+$/));
  const contents = new WeakMap<HTMLElement, Node[]>();
  return (source: DocumentFragment | HTMLElement | ShadowRoot, target: HTMLOListElement) => {
    const exclusions = new Set(source.querySelectorAll('.example'));
    return void define(target, [...source.querySelectorAll<HTMLElement>(`.${category}`)]
      .reduce<Map<string, HTMLLIElement>>((acc, ref, i) => {
        if (exclusions.has(ref.closest('.example')!)) return acc;
        if (!contents.has(ref) && ref.querySelector('a')) return acc;
        void contents.set(ref, contents.get(ref) || [...ref.childNodes]);
        const refIndex = i + 1;
        const refId = ref.id || `${category}:ref:${i + 1}`;
        const title = ref.title || text(ref);
        const def = acc.get(title);
        const defIndex = def
          ? +def.id.match(/[0-9]+/)![0]
          : acc.size + 1;
        const defId = def
          ? def.id
          : `${category}:def:${defIndex}`;
        void define(ref, { id: refId, title: title }, [html('a', { href: `#${defId}`, rel: 'noopener' }, marker(defIndex))]);
        if (def) {
          void def.lastChild!.appendChild(html('a', { href: `#${refId}`, rel: 'noopener' }, `~${refIndex}`));
        }
        else {
          void acc.set(title, html('li', { id: defId }, [
            ...contents.get(ref)!,
            html('sup', [
              html('a', { href: `#${refId}`, rel: 'noopener' }, `~${refIndex}`),
            ])
          ]));
        }
        return acc;
      }, new Map())
      .values());
  };
}
