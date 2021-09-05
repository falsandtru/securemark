import { undefined, Infinity, Map, WeakMap } from 'spica/global';
import { text } from '../inline/extension/indexee';
import { frag, html, define } from 'typed-dom';
import { MultiMap } from 'spica/multimap';
import { memoize } from 'spica/memoize';

export function* footnote(
  target: ParentNode & Node,
  footnotes?: Readonly<{ annotations: HTMLOListElement; references: HTMLOListElement; }>,
  opts: Readonly<{
    id?: string;
  }> = {},
): Generator<HTMLAnchorElement | HTMLLIElement | undefined, undefined, undefined> {
  yield* annotation(target, footnotes?.annotations, opts);
  yield* reference(target, footnotes?.references, opts);
  return;
}

export const annotation = build('annotation', n => `*${n}`);
export const reference = build('reference', (n, abbr) => `[${abbr || n}]`);

const identify = memoize<HTMLElement, string>(
  ref => ref.getAttribute('data-abbr') || ref.innerHTML,
  new WeakMap());

function build(
  syntax: string,
  marker: (index: number, abbr: string | undefined) => string,
): (target: ParentNode & Node, footnote?: HTMLOListElement, opts?: Readonly<{ id?: string }>) => Generator<HTMLAnchorElement | HTMLLIElement | undefined, undefined, undefined> {
  assert(syntax.match(/^[a-z]+$/));
  const contentify = memoize<HTMLElement, DocumentFragment>(
    ref => frag(ref.childNodes),
    new WeakMap());
  return function* (target: ParentNode & Node, footnote?: HTMLOListElement, opts: Readonly<{ id?: string }> = {}): Generator<HTMLAnchorElement | HTMLLIElement | undefined, undefined, undefined> {
    const defs = new Map<string, HTMLLIElement>();
    const refs = new MultiMap<string, HTMLElement>();
    const titles = new Map<string, string>();
    let count = 0;
    for (let es = target.querySelectorAll<HTMLElement>(`sup.${syntax}:not(.disabled)`), i = 0, len = es.length; i < len; ++i) {
      yield;
      const ref = es[i];
      ++count;
      const identifier = identify(ref);
      const abbr = ref.getAttribute('data-abbr') || undefined;
      const title = ref.classList.contains('invalid')
        ? undefined
        : titles.get(identifier) || ref.title || text(ref) || undefined;
      title
        ? !titles.has(identifier) && titles.set(identifier, title)
        : refs.set(identifier, ref);
      const content = contentify(ref);
      const refIndex = count;
      const refId = opts.id !== ''
        ? ref.id || `${syntax}:${opts.id ? `${opts.id}:` : ''}ref:${count}`
        : undefined;
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
        refChild?.getAttribute('href')?.slice(1) === defId && refChild?.textContent === marker(defIndex, abbr)
          ? undefined
          : [html('a', { href: refId && defId && `#${defId}` }, marker(defIndex, abbr))])
        .firstChild as HTMLAnchorElement;
      assert(ref.title || ref.matches('.invalid'));
      assert(ref.firstChild);
      def.lastChild!.appendChild(
        html('a',
          {
            href: refId && `#${refId}`,
            title: content.firstChild && abbr
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
        const node = children[count - 1] as HTMLLIElement;
        if (equal(node, def)) continue I;
        yield footnote.removeChild(node);
        --length;
        assert(children.length === length);
      }
      const node = count <= length
        ? children[count - 1]
        : null;
      if (node && equal(node, def)) continue;
      assert(def.parentNode !== footnote);
      yield footnote.insertBefore(def, node);
      ++length;
      assert(children.length === length);
    }
    while (length > defs.size) {
      yield footnote.removeChild(children[defs.size] as HTMLLIElement);
      --length;
      assert(children.length === length);
    }
    return;
  }
}

function equal(a: Element, b: HTMLElement): boolean {
  return a.id === b.id
      && a.innerHTML === b.innerHTML;
}
