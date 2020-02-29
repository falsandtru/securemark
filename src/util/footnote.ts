import { Infinity } from 'spica/global';
import { context } from './context';
import { text } from '../parser/inline/extension/indexee';
import { MultiMap } from 'spica/multimap';
import { memoize } from 'spica/memoize';
import { frag, html, define } from 'typed-dom';
import { join } from 'spica/array';

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

function build(syntax: string, marker: (index: number) => string): (target: DocumentFragment | HTMLElement | ShadowRoot, footnote: HTMLOListElement) => Generator<HTMLAnchorElement | HTMLLIElement, undefined, undefined> {
  assert(syntax.match(/^[a-z]+$/));
  const contentify = memoize<HTMLElement, DocumentFragment>(
    ref => frag(ref.childNodes),
    new WeakMap());
  return function* (target: DocumentFragment | HTMLElement | ShadowRoot, footnote: HTMLOListElement): Generator<HTMLAnchorElement | HTMLLIElement, undefined, undefined> {
    const check = context(target);
    const defs = new Map<string, HTMLLIElement>();
    const refs = new MultiMap<string, HTMLElement>();
    const titles = new Map<string, string>();
    let count = 0;
    for (const ref of target.querySelectorAll<HTMLElement>(`.${syntax}`)) {
      if (!check(ref)) continue;
      void ++count;
      const identifier = identify(ref);
      const title = ref.classList.contains('invalid')
        ? void 0
        : titles.get(identifier) || ref.title || text(ref) || void 0;
      title && !titles.has(title) && void titles.set(identifier, title);
      !title && void refs.set(identifier, ref);
      const content = contentify(ref);
      const refIndex = count;
      const refId = ref.id || `${syntax}:ref:${count}`;
      const def = defs.has(identifier)
        ? defs.get(identifier)!
        : defs.set(identifier, html('li',
            { id: `${syntax}:def:${defs.size + 1}`, class: 'footnote' },
            [content.cloneNode(true), html('sup', [])]))
            .get(identifier)!;
      assert(def.lastChild);
      if (title && def.childNodes.length === 1 && content.childNodes.length > 0) {
        void def.insertBefore(content.cloneNode(true), def.lastChild);
        assert(def.childNodes.length > 1);
        for (const ref of refs.take(identifier, Infinity)) {
          void ref.classList.remove('invalid');
          void define(ref, {
            title,
            'data-invalid-syntax': null,
            'data-invalid-message': null,
          });
        }
      }
      const defIndex = +def.id.slice(def.id.lastIndexOf(':') + 1);
      const defId = def.id;
      const refChild = ref.firstChild as HTMLAnchorElement | null;
      assert(refChild instanceof HTMLAnchorElement || !refChild);
      yield define(ref,
        {
          id: refId,
          ...title
            ? { title }
            : { class: ref.classList.contains('invalid')
                  ? void 0
                  : join([...ref.classList, 'invalid'], ' '),
                'data-invalid-syntax': syntax,
                'data-invalid-message': 'Missing a content',
              }
        },
        refChild?.getAttribute('href')?.slice(1) === defId && refChild.textContent === marker(defIndex)
          ? void 0
          : [html('a', { href: `#${defId}`, rel: 'noopener' }, marker(defIndex))])
        .firstChild as HTMLAnchorElement;
      assert(ref.title || ref.matches('.invalid'));
      assert(ref.firstChild);
      void def.lastChild!.appendChild(
        html('a',
          {
            href: `#${refId}`,
            rel: 'noopener',
            title: content.childNodes.length > 0 && ref.hasAttribute('data-alias')
              ? title
              : void 0,
          },
          ` ~${refIndex}`));
    }
    count = 0;
    const { children } = footnote;
    I:
    for (const def of defs.values()) {
      void ++count;
      while (children.length > defs.size) {
        if (equal(children[count - 1], def)) continue I;
        yield footnote.removeChild(children[count - 1]) as HTMLLIElement;
      }
      if (children.length >= count && equal(children[count - 1], def)) continue;
      yield footnote.insertBefore(def, children[count - 1] || null);
    }
    while (children.length > defs.size) {
      yield footnote.removeChild(children[defs.size]) as HTMLLIElement;
    }
    return;
  }
}

function equal(a: Element, b: HTMLElement): boolean {
  return a.id === b.id
      && a.innerHTML === b.innerHTML;
}
