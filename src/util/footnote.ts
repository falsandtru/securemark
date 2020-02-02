import { context } from './context';
import { text } from '../parser/inline/extension/indexee';
import { memoize } from 'spica/memoize';
import { frag, html, define } from 'typed-dom';

export function* footnote(target: DocumentFragment | HTMLElement | ShadowRoot, footnotes: { annotation: HTMLOListElement; reference: HTMLOListElement; }): Generator<HTMLAnchorElement | HTMLLIElement, undefined, undefined> {
  yield* annotation(target, footnotes.annotation);
  yield* reference(target, footnotes.reference);
  return;
}

export const annotation = build('annotation', n => `*${n}`);
export const reference = build('reference', n => `[${n}]`);

const identify = memoize<HTMLElement, string>(
  ref => ref.getAttribute('data-abbr') || ref.innerHTML,
  new WeakMap());

function build(group: string, marker: (index: number) => string): (target: DocumentFragment | HTMLElement | ShadowRoot, footnote: HTMLOListElement) => Generator<HTMLAnchorElement | HTMLLIElement, undefined, undefined> {
  assert(group.match(/^[a-z]+$/));
  const contents = new WeakMap<HTMLElement, Node[]>();
  return function* (target: DocumentFragment | HTMLElement | ShadowRoot, footnote: HTMLOListElement): Generator<HTMLAnchorElement | HTMLLIElement, undefined, undefined> {
    const check = context(target);
    const defs = new Map<string, HTMLLIElement>();
    let count = 0;
    for (const ref of target.querySelectorAll<HTMLElement>(`.${group}`)) {
      if (!check(ref)) continue;
      void ++count;
      const identity = identify(ref);
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
      assert(contents.has(ref));
      const refChild = ref.firstChild as HTMLAnchorElement | null;
      yield define(ref, { id: refId, title: ref.title || text(ref) },
        // FIXME: #36031
        refChild?.hash?.slice(1) === defId && refChild.textContent === marker(defIndex)
          ? undefined
          : [html('a', { href: `#${defId}`, rel: 'noopener' }, marker(defIndex))])
        .firstChild as HTMLAnchorElement;
      if (def) {
        void def.lastChild!.appendChild(html('a', { href: `#${refId}`, rel: 'noopener' }, ` ~${refIndex}`));
      }
      else {
        const content = contents.get(ref)!;
        void defs.set(identity, html('li', { id: defId, class: 'footnote' }, [
          content.length === 0 || content[0].parentNode === ref
            ? frag(content)
            : frag(content).cloneNode(true),
          html('sup', [
            html('a', { href: `#${refId}`, rel: 'noopener' }, ` ~${refIndex}`),
          ]),
        ]));
      }
    }
    count = 0;
    I:
    for (const def of defs.values()) {
      void ++count;
      while (footnote.children.length > defs.size) {
        if (footnote.children[count - 1].outerHTML === def.outerHTML) continue I;
        yield footnote.removeChild(footnote.children[count - 1]) as HTMLLIElement;
      }
      if (footnote.children.length >= count && footnote.children[count - 1].outerHTML === def.outerHTML) continue;
      yield footnote.insertBefore(def, footnote.children[count - 1] || null);
    }
    while (footnote.children.length > defs.size) {
      yield footnote.removeChild(footnote.children[defs.size]) as HTMLLIElement;
    }
    return;
  }
}
