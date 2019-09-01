import { context } from './context';
import { text } from '../parser/inline/extension/indexer';
import { html, define } from 'typed-dom';

export function footnote(target: DocumentFragment | HTMLElement | ShadowRoot, footnotes: { annotation: HTMLOListElement; reference: HTMLOListElement; }): void {
  void annotation(target, footnotes.annotation);
  void reference(target, footnotes.reference);
}

export const annotation = build('annotation', n => `*${n}`);
export const reference = build('reference', n => `[${n}]`);

function build(category: string, marker: (index: number) => string): (target: DocumentFragment | HTMLElement | ShadowRoot, footnote: HTMLOListElement) => void {
  assert(category.match(/^[a-z]+$/));
  const contents = new WeakMap<HTMLElement, Node[]>();
  return (target: DocumentFragment | HTMLElement | ShadowRoot, footnote: HTMLOListElement) => {
    return void define(footnote, [...target.querySelectorAll<HTMLElement>(`.${category}`)]
      .filter(context(target))
      .reduce<Map<string, HTMLLIElement>>((acc, ref, i) => {
        const refIndex = i + 1;
        const refId = ref.id || `${category}:ref:${i + 1}`;
        const title = ref.title || text(ref);
        const def = acc.get(title);
        const defIndex = def
          ? +def.id.slice(def.id.lastIndexOf(':') + 1)
          : acc.size + 1;
        const defId = def
          ? def.id
          : `${category}:def:${defIndex}`;
        void contents.set(ref, contents.get(ref) || [...ref.childNodes]);
        void define(ref, { id: refId, title: title }, [html('a', { href: `#${defId}`, rel: 'noopener' }, marker(defIndex))]);
        if (def) {
          void def.lastChild!.appendChild(html('a', { href: `#${refId}`, rel: 'noopener' }, `~${refIndex}`));
        }
        else {
          void acc.set(title, html('li', { id: defId, class: 'footnote' }, [
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
