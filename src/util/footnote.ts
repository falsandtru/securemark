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
  ref => ref.getAttribute('data-alias') || ref.innerHTML,
  new WeakMap());

function build(group: string, marker: (index: number) => string): (target: DocumentFragment | HTMLElement | ShadowRoot, footnote: HTMLOListElement) => Generator<HTMLAnchorElement | HTMLLIElement, undefined, undefined> {
  assert(group.match(/^[a-z]+$/));
  const contents = new WeakMap<HTMLElement, Node[]>();
  return function* (target: DocumentFragment | HTMLElement | ShadowRoot, footnote: HTMLOListElement): Generator<HTMLAnchorElement | HTMLLIElement, undefined, undefined> {
    const check = context(target);
    const defs = new Map<string, HTMLLIElement>();
    const titles = new Map<string, string>();
    let count = 0;
    for (const ref of target.querySelectorAll<HTMLElement>(`.${group}`)) {
      if (!check(ref)) continue;
      void ++count;
      const identifier = identify(ref);
      const refIndex = count;
      const refId = ref.id || `${group}:ref:${count}`;
      const def = defs.get(identifier);
      const defIndex = def
        ? +def.id.slice(def.id.lastIndexOf(':') + 1)
        : defs.size + 1;
      const defId = def
        ? def.id
        : `${group}:def:${defIndex}`;
      const title = ref.classList.contains('invalid')
        ? ''
        : titles.get(identifier) || ref.title || text(ref);
      const refChild = ref.firstChild as HTMLAnchorElement | null;
      title && !contents.has(ref) && void contents.set(ref, [...ref.childNodes]);
      title && !titles.has(title) && void titles.set(identifier, title);
      yield define(ref,
        title
          ? { id: refId, title }
          : { id: refId,
              class: ref.classList.contains('invalid')
                ? undefined
                : [...ref.classList, 'invalid'].join(' '),
              'data-invalid-syntax': group,
              'data-invalid-message': 'Footnotes must be set a content at the first use of the each alias',
            },
        // FIXME: #36031
        refChild?.hash?.slice(1) === defId && refChild.textContent === marker(defIndex)
          ? undefined
          : [html('a', { href: `#${defId}`, rel: 'noopener' }, marker(defIndex))])
        .firstChild as HTMLAnchorElement;
      assert(ref.firstChild);
      if (def) {
        void def.lastChild!.appendChild(
          html('a', { href: `#${refId}`, rel: 'noopener' }, ` ~${refIndex}`));
        if (def.childNodes.length === 1 && contents.has(ref)) {
          const content = contents.get(ref) || [];
          void def.insertBefore(
            content.length === 0 || content[0].parentNode === ref
              ? frag(content)
              : frag(content).cloneNode(true),
            def.lastChild);
        }
        continue;
      }
      else {
        const content = contents.get(ref) || [];
        void defs.set(identifier,
          html('li', { id: defId, class: 'footnote' }, [
            content.length === 0 || content[0].parentNode === ref
              ? frag(content)
              : frag(content).cloneNode(true),
            html('sup', [
              html('a', { href: `#${refId}`, rel: 'noopener' }, ` ~${refIndex}`),
            ]),
          ]));
        continue;
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
