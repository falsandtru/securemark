import { undefined, Infinity, Map, WeakMap } from 'spica/global';
import { text } from '../parser/inline/extension/indexee';
import { MultiMap } from 'spica/multimap';
import { memoize } from 'spica/memoize';
import { frag, html, define } from 'typed-dom';

export function* footnote(
  target: DocumentFragment | HTMLElement | ShadowRoot,
  footnotes?: Readonly<{ annotation: HTMLOListElement; reference: HTMLOListElement; }>,
  opts: Readonly<{
    id?: string;
  }> = {},
): Generator<HTMLAnchorElement | HTMLLIElement | undefined, undefined, undefined> {
  yield* annotation(target, footnotes?.annotation, opts);
  yield* reference(target, footnotes?.reference, opts);
  return;
}

export const annotation = build('annotation', n => `*${n}`);
export const reference = build('reference', n => `[${n}]`);

const identify = memoize<HTMLElement, string>(
  ref => ref.getAttribute('data-alias') || ref.innerHTML,
  new WeakMap());

function build(
  syntax: string,
  marker: (index: number) => string,
): (target: DocumentFragment | HTMLElement | ShadowRoot, footnote?: HTMLOListElement, opts?: Readonly<{ id?: string }>) => Generator<HTMLAnchorElement | HTMLLIElement | undefined, undefined, undefined> {
  assert(syntax.match(/^[a-z]+$/));
  const contentify = memoize<HTMLElement, DocumentFragment>(
    ref => frag(ref.childNodes),
    new WeakMap());
  return function* (target: DocumentFragment | HTMLElement | ShadowRoot, footnote?: HTMLOListElement, opts: Readonly<{ id?: string }> = {}): Generator<HTMLAnchorElement | HTMLLIElement | undefined, undefined, undefined> {
    const defs = new Map<string, HTMLLIElement>();
    const refs = new MultiMap<string, HTMLElement>();
    const titles = new Map<string, string>();
    let count = 0;
    for (let es = target.querySelectorAll<HTMLElement>(`sup.${syntax}:not(.disabled)`), i = 0, len = es.length; i < len; ++i) {
      yield;
      const ref = es[i];
      ++count;
      const identifier = identify(ref);
      const title = ref.classList.contains('invalid')
        ? undefined
        : titles.get(identifier) || ref.title || text(ref) || undefined;
      title && !titles.has(title) && titles.set(identifier, title);
      !title && refs.set(identifier, ref);
      const content = contentify(ref);
      const refIndex = count;
      const refId = opts.id !== '' ? ref.id || `${syntax}:${opts.id ? `${opts.id}:` : ''}ref:${count}` : undefined;
      const def = undefined
        || defs.get(identifier)
        || defs.set(identifier, html('li',
            { id: opts.id !== '' ? `${syntax}:${opts.id ? `${opts.id}:` : ''}def:${defs.size + 1}` : undefined },
            [content.cloneNode(true), html('sup', [])]))
            .get(identifier)!;
      assert(def.lastChild);
      if (title && content.firstChild && def.childNodes.length === 1) {
        def.insertBefore(content.cloneNode(true), def.lastChild);
        assert(def.childNodes.length > 1);
        for (const ref of refs.take(identifier, Infinity)) {
          ref.classList.remove('invalid');
          define(ref, {
            title,
            'data-invalid-syntax': null,
            'data-invalid-type': null,
            'data-invalid-description': null,
          });
        }
      }
      const defIndex = +def.id.slice(def.id.lastIndexOf(':') + 1) || defs.size;
      const defId = def.id || undefined;
      const refChild = ref.firstChild as HTMLAnchorElement | null;
      assert(refChild instanceof HTMLAnchorElement || !refChild);
      yield define(ref,
        {
          id: refId,
          class: opts.id !== '' ? undefined : `${ref.className} disabled`,
          ...title
            ? { title }
            : { class: void ref.classList.add('invalid'),
                'data-invalid-syntax': syntax,
                'data-invalid-type': 'content',
                'data-invalid-description': 'Missing the content.',
              }
        },
        refChild?.getAttribute('href')?.slice(1) === defId && refChild?.textContent === marker(defIndex)
          ? undefined
          : [html('a', { href: refId && defId && `#${defId}`, rel: 'noopener' }, marker(defIndex))])
        .firstChild as HTMLAnchorElement;
      assert(ref.title || ref.matches('.invalid'));
      assert(ref.firstChild);
      def.lastChild!.appendChild(
        html('a',
          {
            href: refId && `#${refId}`,
            rel: 'noopener',
            title: content.firstChild && ref.hasAttribute('data-alias')
              ? title
              : undefined,
          },
          `~${refIndex}`));
    }
    if (!footnote) return;
    const { children } = footnote;
    count = 0;
    let length = children.length;
    I:
    for (const def of defs.values()) {
      ++count;
      while (length > defs.size) {
        const node = children[count - 1];
        if (equal(node, def)) continue I;
        yield footnote.removeChild(node) as HTMLLIElement;
        --length;
      }
      const node = count <= length
        ? children[count - 1]
        : null;
      if (node && equal(node, def)) continue;
      assert(def.parentNode !== footnote);
      yield footnote.insertBefore(def, node);
      ++length;
    }
    while (length > defs.size) {
      yield footnote.removeChild(children[defs.size]) as HTMLLIElement;
      --length;
    }
    return;
  }
}

function equal(a: Element, b: HTMLElement): boolean {
  return a.id === b.id
      && a.innerHTML === b.innerHTML;
}
