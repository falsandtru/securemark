import { context } from './context';
import { text } from '../parser/inline/extension/indexee';
import { html, define } from 'typed-dom';

export function* footnote(target: DocumentFragment | HTMLElement | ShadowRoot, footnotes: { annotation: HTMLOListElement; reference: HTMLOListElement; }): Generator<HTMLLIElement | HTMLAnchorElement, undefined, undefined> {
  yield* annotation(target, footnotes.annotation);
  yield* reference(target, footnotes.reference);
  return;
}

export const annotation = build('annotation', n => `*${n}`);
export const reference = build('reference', n => `[${n}]`);

function build(group: string, marker: (index: number) => string): (target: DocumentFragment | HTMLElement | ShadowRoot, footnote: HTMLOListElement) => Generator<HTMLLIElement | HTMLAnchorElement, undefined, undefined> {
  assert(group.match(/^[a-z]+$/));
  const contents = new WeakMap<HTMLElement, Node[]>();
  return function* (target: DocumentFragment | HTMLElement | ShadowRoot, footnote: HTMLOListElement): Generator<HTMLLIElement | HTMLAnchorElement, undefined, undefined> {
    const check = context(target);
    const defs = new Map<string, HTMLLIElement>();
    while (footnote.firstChild) {
      yield footnote.removeChild(footnote.firstChild) as HTMLLIElement;
    }
    let count = 0;
    for (const ref of target.querySelectorAll<HTMLElement>(`.${group}`)) {
      if (!check(ref)) continue;
      void ++count;
      const identity = ref.innerHTML;
      const refIndex = count;
      const refId = ref.id || `${group}:ref:${count}`;
      const def = defs.get(identity);
      const defIndex = def
        ? +def.id.slice(def.id.lastIndexOf(':') + 1)
        : defs.size + 1;
      const defId = def
        ? def.id
        : `${group}:def:${defIndex}`;
      !contents.has(ref) && void contents.set(ref, [...ref.childNodes]);
      void define(ref, { id: refId, title: ref.title || text(ref) }, [html('a', { href: `#${defId}`, rel: 'noopener' }, marker(defIndex))]);
      if (def) {
        yield def.lastChild!.appendChild(html('a', { href: `#${refId}`, rel: 'noopener' }, `~${refIndex}`));
      }
      else {
        const def = html('li', { id: defId, class: 'footnote' }, [
          ...contents.get(ref)!,
          html('sup', [
            html('a', { href: `#${refId}`, rel: 'noopener' }, `~${refIndex}`),
          ])
        ]);
        void defs.set(identity, def);
        yield footnote.appendChild(def).lastChild!.lastChild! as HTMLAnchorElement;
      }
    }
    return;
  }
}
