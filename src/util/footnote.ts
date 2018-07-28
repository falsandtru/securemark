import { text } from '../parser/block/indexer';
import { TypedHTML, html, define } from 'typed-dom';

export function footnote(source: DocumentFragment | HTMLElement, targets: { annotation: HTMLOListElement; authority: HTMLOListElement; }): void {
  void annotation(source, targets.annotation);
  void authority(source, targets.authority);
}

export const annotation = build('annotation', n => `(${n})`);
export const authority = build('authority', n => `[${n}]`);

function build(category: string, indexer: (index: number) => string): (source: DocumentFragment | HTMLElement, target: HTMLOListElement) => void {
  assert(category.match(/^[a-z]+$/));
  const memory = new WeakMap<HTMLElement, Node[]>();
  return (source: DocumentFragment | HTMLElement, target: HTMLOListElement) => {
    target.innerHTML = '';
    const definitions = new Map<string, HTMLLIElement>();
    return void source.querySelectorAll<HTMLElement>(`.${category}`)
      .forEach((ref, i) => {
        !memory.has(ref) && void memory.set(ref, [...ref.childNodes]);
        const refIndex = i + 1;
        const refId = ref.id || `${category}-ref:${i + 1}`;
        const title = ref.title || text(ref);
        const def = definitions.get(title);
        const defIndex = def
          ? +def.id.match(/\d+/)![0]
          : definitions.size + 1;
        const defId = def
          ? def.id
          : `${category}-def:${defIndex}`;
        ref.innerHTML = '';
        void define(ref, { id: refId, title: title }, [html('a', { href: `#${defId}`, rel: 'noopener' }, indexer(defIndex))]);
        return def
          ? void def.lastChild!.appendChild(html('a', { href: `#${refId}`, rel: 'noopener' }, indexer(refIndex)))
          : void target.appendChild(
              TypedHTML.li((f, tag) => {
                const el = f(tag, { id: defId }, [
                  ...memory.get(ref)!,
                  html('sup', [
                    html('a', { href: `#${refId}`, rel: 'noopener' }, indexer(refIndex)),
                  ])
                ]);
                void definitions.set(title, el);
                return el;
              }).element);
      });
  };
}
